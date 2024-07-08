import { Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { CustomRequest } from './authMiddleware';

export const errorMulterMiddleware = (err: any, req: CustomRequest, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected field: Only one file is allowed in the data field' });
    }
  }
  next(err);
};
