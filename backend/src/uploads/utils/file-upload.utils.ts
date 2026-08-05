import { BadRequestException } from '@nestjs/common';

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb

export function validateImageFile(file?: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException('No file provided.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestException(
      `Invalid file type '${file.mimetype}'. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestException(
      `File size exceeds maximum allowed limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    );
  }
}
