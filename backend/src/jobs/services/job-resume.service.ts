import { Injectable } from '@nestjs/common';
import { UploadsService } from '../../uploads/uploads.service';
import { UploadFolder } from '../../uploads/enums/upload-folder.enum';

@Injectable()
export class JobResumeService {
  constructor(private readonly uploadsService: UploadsService) {}

  async uploadResume(file: Express.Multer.File): Promise<string> {
    return await this.uploadsService.uploadSingle(file, UploadFolder.RESUMES);
  }
}
