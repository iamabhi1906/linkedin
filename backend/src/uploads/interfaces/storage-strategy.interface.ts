export interface StorageStrategy {
  upload(file: Express.Multer.File, folder: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
}
