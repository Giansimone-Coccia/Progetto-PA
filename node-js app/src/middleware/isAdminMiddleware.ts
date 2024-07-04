import { Response, NextFunction } from 'express';
import { CustomRequest } from '../middleware/authMiddleware';

export const authorizeAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};
