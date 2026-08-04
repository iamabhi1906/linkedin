import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import ChatGateway from './chat.gateway';
import { TokenModule } from '../token/token.module';
import { LiveChatService } from './services/chat.service';
import { SocketAuthService } from './services/socket-auth.service';
import { SocketStateService } from './services/socket-state.service';

@Module({
  imports: [TokenModule],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    LiveChatService,
    SocketAuthService,
    SocketStateService,
  ],
  exports: [ChatGateway, LiveChatService],
})
export class ChatModule {}
