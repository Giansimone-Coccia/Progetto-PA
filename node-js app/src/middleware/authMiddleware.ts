import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserAttributes } from '../models/user';

// Define an interface CustomRequest that extends Express Request
// and includes a user property of type UserAttributes
export interface CustomRequest extends Request {
  user?: UserAttributes; // Adds the user property to the Request interface
}

// Get JWT secret from environment variable or set a default value
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware function to authenticate JWT tokens
export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Extract the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (authHeader) {
    // Split the Authorization header value to separate the Bearer token
    const token = authHeader.split(' ')[1];

    // Verify the JWT token using the secret key
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        // If verification fails, send a 403 Forbidden status
        return res.sendStatus(403);
      }

      // If verification succeeds, set the user property on req to the decoded user object
      req.user = user as UserAttributes;

      // Call the next middleware function in the chain
      next();
    });
  } else {
    // If no Authorization header is present, send a 401 Unauthorized status
    res.sendStatus(401);
  }
};
