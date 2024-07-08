import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import UserRepositoryImpl from '../repositories/implementations/userRepositoryImpl';
import UserDAO from '../dao/implementations/userDAOImpl';

class AuthController {
  private static instance: AuthController;
  private userService: UserService;
  private secret: string;

  private constructor() {
    const userDAO = new UserDAO();
    const userRepository = new UserRepositoryImpl(userDAO);
    this.userService = UserService.getInstance(userRepository);

    this.secret = process.env.JWT_SECRET || 'your_jwt_secret';
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.userService.createUser({ email, password: hashedPassword, role });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'User already exists' });
    }
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, this.secret, {
      expiresIn: '1h',
    });

    res.json({ token });
  };
}

export default AuthController;
