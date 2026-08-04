import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class LiveChatService {
  private server!: Server;
  setServer(server: Server) {
    this.server = server;
  }
  emitToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
  emitToConversation(id: string, event: string, payload: any) {
    this.server.to(`conversation:${id}`).emit(event, payload);
  }
}
