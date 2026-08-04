import { Controller, Get } from '@nestjs/common';
import ChatGateway from './chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway) {}
  @Get()
  handleChatSend() {
    this.chatGateway.server.emit('ping', 'pong');
    return 'Event emitted..!!';
  }
}
