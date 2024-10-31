import { BadRequestException } from '@nestjs/common';

export const validateImage = (file: Express.Multer.File) => {
  if (file.size > 1024 * 1024 * 6) {
    throw new BadRequestException('File is too large');
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'image/avif',
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type');
  }
};
