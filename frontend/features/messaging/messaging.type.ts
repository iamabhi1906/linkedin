
import { User } from '../user/user.type';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  type: string;
  updatedAt: string;
  otherUser: User | null;
  lastMessage: Message | null;
}
