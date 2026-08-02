import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { StorageStrategy } from '../interfaces/storage-strategy.interface';

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
  private readonly publicDir = path.join(process.cwd(), 'public');

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const targetDir = path.join(this.publicDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fileExt = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${randomUUID()}${fileExt}`;
    const filePath = path.join(targetDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);
    return `/public/${folder}/${filename}`;
  }

  async delete(filePath: string): Promise<void> {
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const fullPath = path.join(process.cwd(), cleanPath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  getUrl(filePath: string): string {
    return filePath;
  }
}
