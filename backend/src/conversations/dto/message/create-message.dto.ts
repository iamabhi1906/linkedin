export default class CreateNewMessageDTO {
  conversationId!: string;
  senderId!: string;
  content!: string | null;
  mediaUrl!: string | null;
  mediaType!: string | null;
}
