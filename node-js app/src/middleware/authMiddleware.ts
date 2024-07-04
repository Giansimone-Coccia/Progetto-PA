import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { UserAttributes } from '../models/User';

export interface CustomRequest extends Request {
  user?: string | JwtPayload | UserAttributes; // Aggiungi la proprietà user all'interfaccia Request
}

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user as UserAttributes;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
