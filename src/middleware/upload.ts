import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, './uploads');
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(
      new ValidationError(
        `Invalid file type. Allowed types are: ${ALLOWED_IMAGE_TYPES.map(
          (type) => type.split('/')[1]
        ).join(', ')}`
      )
    );
    return;
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    cb(
      new ValidationError(
        'Invalid file extension. Allowed extensions are: jpg, jpeg, png'
      )
    );
    return;
  }

  cb(null, true);
};

const handleMulterError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: `File size too large. Maximum size is ${(
          MAX_FILE_SIZE /
          (1024 * 1024)
        ).toString()}MB`,
      });
    }
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }

  next(error);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export { handleMulterError };
