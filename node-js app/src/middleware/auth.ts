import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: User;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Token mancante');
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      throw new Error('Utente non trovato');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Autenticazione fallita' });
  }
};

export default auth;
