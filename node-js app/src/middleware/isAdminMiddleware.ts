import { Response, NextFunction } from 'express';
import { CustomRequest } from '../middleware/authMiddleware';

/**
 * Middleware function to authorize admin access.
 * @param {CustomRequest} req - The Express request object with user information.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the chain.
 */
export const authorizeAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Check if the user is authenticated and has the role of admin
  if (req.user?.role === 'admin') {
    // If user is admin, proceed to the next middleware function
    next();
  } else {
    // If user is not admin, send a 403 Forbidden status response
    res.sendStatus(403); // Forbidden
  }
};
