import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';
import { type AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/request/create-conversation.dto';
import { SendMessageDto } from './dto/request/send-message.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) { }

  @Post()
  async getOrCreate(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateConversationDto,
  ) {
    const conversation = await this.conversationsService.getOrCreateConversation(
      req.user.sub,
      dto.targetUserId,
    );
    return { status: 'success', conversation };
  }

  @Get()
  async getUserConversations(@Req() req: AuthenticatedRequest) {
    const conversations = await this.conversationsService.getUserConversations(
      req.user.sub,
    );
    return { status: 'success', conversations };
  }

  @Get(':id/messages')
  async getMessages(
    @Req() req: AuthenticatedRequest,
    @Param('id') conversationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.conversationsService.getMessages(
      conversationId,
      req.user.sub,
      page ? Number(page) : 1,
      limit ? Number(limit) : 50,
    );
    return { status: 'success', ...result };
  }

  @Post(':id/messages')
  @UseInterceptors(FileInterceptor('file'))
  async sendMessage(
    @Req() req: AuthenticatedRequest,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const message = await this.conversationsService.sendMessage(
      conversationId,
      req.user.sub,
      dto,
      file,
    );
    return { status: 'success', message };
  }
}
