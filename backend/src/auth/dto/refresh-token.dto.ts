import { IsOptional, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @IsOptional()
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken?: string;
}
