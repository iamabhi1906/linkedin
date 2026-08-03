import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsUUID()
  targetUserId: string;
}
