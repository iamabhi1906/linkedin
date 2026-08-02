import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { UploadFolder } from './enums/upload-folder.enum';
import { JwtAuthGuard } from 'src/infra/guards/jwt.guard';

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @ApiOperation({ summary: 'Upload a single file' })
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: UploadFolder,
  ) {
    const url = await this.uploadsService.uploadSingle(file, folder);
    return { url };
  }

  @ApiOperation({ summary: 'Upload multiple files' })
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: UploadFolder,
  ) {
    const urls = await this.uploadsService.uploadMultiple(files, folder);
    return { urls };
  }

  @ApiOperation({ summary: 'Delete an uploaded file by path' })
  @Delete()
  async deleteFile(@Body('filePath') filePath: string) {
    await this.uploadsService.deleteFile(filePath);
    return { message: 'File deleted successfully' };
  }
}
