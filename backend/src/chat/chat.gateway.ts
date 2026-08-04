import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { SocketAuthService } from './services/socket-auth.service';
import { SocketStateService } from './services/socket-state.service';
import type { AuthenticatedSocket } from './interface/authenticated-socket.interface';
import { LiveChatService } from './services/chat.service';
import type TypingDTO from './dto/typing.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  constructor(
    private readonly authService: SocketAuthService,
    private readonly socketState: SocketStateService,
    private readonly chatService: LiveChatService,
  ) {}
  afterInit() {
    this.chatService.setServer(this.server);
  }

  async handleConnection(client: AuthenticatedSocket) {
    const userId = await this.authService.authenticate(client);
    client.data.userId = userId;
    this.socketState.add(userId, client.id);
    await client.join(`user:${userId}`);
    console.log(`${userId} connected`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.data.userId;
    if (this.socketState.remove(userId, client.id)) {
      this.server.emit('userOffline', { userId });
    }
  }

  // @SubscribeMessage('joinConversation')
  // joinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() dto: JoinConversationDto,
  // ) {
  //   client.join(`conversation:${dto.conversationId}`);
  // }

  // @SubscribeMessage('leaveConversation')
  // leaveRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() dto: JoinConversationDto,
  // ) {
  //   client.leave(`conversation:${dto.conversationId}`);
  // }

  @SubscribeMessage('typing')
  typing(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: TypingDTO,
  ) {
    console.log('Typing event');
    client.to(`conversation:${dto.conversationId}`).emit('userTyping', {
      ...dto,
      userId: client.data.userId,
    });
  }
}

export default ChatGateway;
