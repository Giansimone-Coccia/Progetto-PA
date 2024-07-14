import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * Error handling middleware for Express applications.
 * Catches errors and sends a JSON response with the appropriate status code and message.
 *
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;  // Determine the status code, default to 500
  const message = err.message || 'Internal Server Error';  // Determine the message, default to 'Internal Server Error'

  res.status(statusCode).json({ message });  // Send the error response as JSON
};

export default errorHandler;
