import { IsString } from 'class-validator';

class TypingDTO {
  @IsString()
  conversationId!: string;
}

export default TypingDTO;
