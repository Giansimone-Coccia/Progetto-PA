import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: 'Credenziali non valide' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUserTokens = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    res.send({ tokens: user.tokens });
  } catch (error) {
    res.status(400).send(error);
  }
};
