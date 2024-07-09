import { Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { CustomRequest } from './authMiddleware';

/**
 * Middleware function to handle Multer errors.
 * @param {any} err - The error object thrown by Multer or other middleware.
 * @param {CustomRequest} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the chain.
 */
export const errorMulterMiddleware = (err: any, req: CustomRequest, res: Response, next: NextFunction) => {
  // Check if the error is an instance of MulterError
  if (err instanceof MulterError) {
    // Handle specific Multer error types
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      // If the error is due to unexpected files, respond with a 400 Bad Request status
      return res.status(400).json({ message: 'Unexpected field: Only one file is allowed in the data field' });
    }
  }

  // Pass the error to the next error-handling middleware in the chain
  next(err);
};
