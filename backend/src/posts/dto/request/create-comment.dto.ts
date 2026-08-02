import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text content',
    example: 'Congratulations!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  content!: string;
}
