import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketStateService {
  private readonly users = new Map<string, Set<string>>();
  add(userId: string, socketId: string) {
    if (!this.users.has(userId)) {
      this.users.set(userId, new Set());
    }
    this.users.get(userId)!.add(socketId);
  }
  remove(userId: string, socketId: string) {
    const sockets = this.users.get(userId);
    if (!sockets) return false;
    sockets.delete(socketId);
    if (sockets.size === 0) {
      this.users.delete(userId);
      return true;
    }
    return false;
  }
  isOnline(userId: string) {
    return this.users.has(userId);
  }
}
