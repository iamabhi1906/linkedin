import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5050';

let socket: Socket | null = null;

export const socketService = {
  connect(): Socket {
    if (socket && socket.connected) {
      return socket;
    }

    if (socket) {
      socket.disconnect();
    }

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected successfully with ID:', socket?.id);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    return socket;
  },

  getSocket(): Socket | null {
    return socket;
  },

  disconnect(): void {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  joinConversation(conversationId: string): void {
    if (socket?.connected) {
      socket.emit('joinConversation', { conversationId });
    }
  },

  leaveConversation(conversationId: string): void {
    if (socket?.connected) {
      socket.emit('leaveConversation', { conversationId });
    }
  },

  sendTyping(conversationId: string, isTyping: boolean): void {
    if (socket?.connected) {
      socket.emit('typing', { conversationId, isTyping });
    }
  },
};
