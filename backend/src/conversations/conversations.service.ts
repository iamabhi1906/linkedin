import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Message } from './entities/message.entity';
import { Follow } from '../follows/entities/follow.entity';
import { FollowStatus } from '../follows/enums/follow-status.enum';
import { UploadsService } from '../uploads/uploads.service';
import { UploadFolder } from '../uploads/enums/upload-folder.enum';
import { SendMessageDto } from './dto/request/send-message.dto';
import { LiveChatService } from 'src/chat/services/chat.service';
import 'multer';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly uploadsService: UploadsService,
    private readonly chatGateway: LiveChatService,
  ) {}

  async getOrCreateConversation(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Conversation> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException(
        'Cannot start a conversation with yourself',
      );
    }
    const followRelation = await this.followRepository.findOne({
      where: [
        {
          followerId: currentUserId,
          followingId: targetUserId,
          status: FollowStatus.ACCEPTED,
        },
        {
          followerId: targetUserId,
          followingId: currentUserId,
          status: FollowStatus.ACCEPTED,
        },
      ],
    });

    if (!followRelation) {
      throw new ForbiddenException(
        'Messaging is only allowed between connected users that follow each other',
      );
    }

    const myParticipants = await this.participantRepository.find({
      where: { userId: currentUserId },
      relations: { conversation: { participants: { user: true } } },
    });

    for (const p of myParticipants) {
      const conv = p.conversation;
      if (conv.type === 'DIRECT') {
        const hasTarget = conv.participants.some(
          (part) => part.userId === targetUserId,
        );
        if (hasTarget) {
          return conv;
        }
      }
    }

    const newConv = this.conversationRepository.create({
      type: 'DIRECT',
      participants: [
        this.participantRepository.create({ userId: currentUserId }),
        this.participantRepository.create({ userId: targetUserId }),
      ],
    });

    const savedConv = await this.conversationRepository.save(newConv);

    const populatedConv =
      (await this.conversationRepository.findOne({
        where: { id: savedConv.id },
        relations: {
          participants: { user: true },
        },
      })) || savedConv;

    this.chatGateway.emitToUser(targetUserId, 'conversationCreated', {
      conversation: populatedConv,
    });
    return populatedConv;
  }

  async getUserConversations(userId: string) {
    const myParticipants = await this.participantRepository.find({
      where: { userId },
      relations: {
        conversation: {
          participants: { user: true },
          messages: { sender: true },
        },
      },
      order: { conversation: { updatedAt: 'DESC' } },
    });

    return myParticipants.map((p) => {
      const conv = p.conversation;
      const otherParticipant = conv.participants.find(
        (part) => part.userId !== userId,
      );
      const messages = conv.messages || [];
      messages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const lastMessage = messages[0] || null;

      return {
        id: conv.id,
        type: conv.type,
        updatedAt: conv.updatedAt,
        otherUser: otherParticipant?.user || null,
        lastMessage,
      };
    });
  }

  async getMessages(
    conversationId: string,
    userId: string,
    page = 1,
    limit = 50,
  ) {
    const isParticipant = await this.participantRepository.findOne({
      where: { conversationId, userId },
    });

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }
    const skip = (page - 1) * limit;
    const [messages, total] = await this.messageRepository.findAndCount({
      where: { conversationId },
      relations: { sender: true },
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    await this.participantRepository.update(
      { conversationId, userId },
      { lastReadAt: new Date() },
    );

    return {
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    dto: SendMessageDto,
    file?: Express.Multer.File,
  ) {
    const participant = await this.participantRepository.findOne({
      where: { conversationId, userId: senderId },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    let mediaUrl = dto.mediaUrl || null;
    let mediaType = dto.mediaType || null;

    if (file) {
      const path = await this.uploadsService.uploadSingle(
        file,
        UploadFolder.POST_MEDIA,
      );
      mediaUrl = `http://localhost:5050${path}`;
      mediaType = file.mimetype;
    }

    if (!dto.content?.trim() && !mediaUrl) {
      throw new BadRequestException('Message must contain content or media');
    }

    const newMessage = this.messageRepository.create({
      conversationId,
      senderId,
      content: dto.content?.trim() || null,
      mediaUrl,
      mediaType,
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    await this.conversationRepository.update(conversationId, {
      updatedAt: new Date(),
    });

    await this.participantRepository.update(
      { conversationId, userId: senderId },
      { lastReadAt: new Date() },
    );

    const fullMessage = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: { sender: true },
    });
    if (fullMessage) {
      const participants = await this.participantRepository.find({
        where: { conversationId },
      });
      const payload = {
        message: fullMessage,
        conversationId,
      };
      this.chatGateway.emitToConversation(
        conversationId,
        'newMessage',
        payload,
      );
      for (const p of participants) {
        this.chatGateway.emitToUser(p.userId, 'newMessage', payload);
      }
    }
    return fullMessage;
  }
}
