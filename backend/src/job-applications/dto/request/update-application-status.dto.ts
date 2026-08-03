import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStatus } from '../../enums/application-status.enum';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  status!: ApplicationStatus;
}
