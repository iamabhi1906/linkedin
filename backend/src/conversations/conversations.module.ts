import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Message } from './entities/message.entity';
import { Follow } from '../follows/entities/follow.entity';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      ConversationParticipant,
      Message,
      Follow,
    ]),
    UploadsModule,
    TokenModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule { }
