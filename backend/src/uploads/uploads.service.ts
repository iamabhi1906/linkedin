import { Inject, Injectable } from '@nestjs/common';
import type { StorageStrategy } from './interfaces/storage-strategy.interface';
import { UploadFolder } from './enums/upload-folder.enum';
import { validateImageFile } from './utils/file-upload.utils';

@Injectable()
export class UploadsService {
  constructor(
    @Inject('STORAGE_STRATEGY')
    private readonly storageStrategy: StorageStrategy,
  ) {}

  validateImage(file?: Express.Multer.File): void {
    validateImageFile(file);
  }

  async uploadSingle(
    file: Express.Multer.File,
    folder: UploadFolder = UploadFolder.TEMP,
  ): Promise<string> {
    this.validateImage(file);
    return this.storageStrategy.upload(file, folder);
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder: UploadFolder = UploadFolder.TEMP,
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    files.forEach((file) => this.validateImage(file));

    const uploadPromises = files.map((file) =>
      this.storageStrategy.upload(file, folder),
    );
    return Promise.all(uploadPromises);
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!filePath) return;
    await this.storageStrategy.delete(filePath);
  }

  async replaceFile(
    oldFilePath: string,
    newFile: Express.Multer.File,
    folder: UploadFolder = UploadFolder.TEMP,
  ): Promise<string> {
    const newPath = await this.uploadSingle(newFile, folder);
    if (oldFilePath) {
      await this.deleteFile(oldFilePath).catch(() => null);
    }
    return newPath;
  }

  getPublicUrl(filePath: string): string {
    return this.storageStrategy.getUrl(filePath);
  }
}
