import { Response } from 'express';
import { CustomRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';
import UserDAO from '../dao/implementations/userDAOImpl';
import UserRepositoryImpl from '../repositories/implementations/userRepositoryImpl';

class UserController {
  private userService: UserService;
  private static instance: UserController;

  private constructor() {
    const userDAO = new UserDAO();
    const userRepository = new UserRepositoryImpl(userDAO);
    this.userService = new UserService(userRepository);
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public getAllUsers = async (req: CustomRequest, res: Response) => {
    const users = await this.userService.getAllUsers();
    res.json(users);
  };

  public getUserById = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await this.userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  public createUser = async (req: CustomRequest, res: Response) => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  };

  public updateUser = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await this.userService.updateUser(id, req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  public deleteUser = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const success = await this.userService.deleteUser(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  public getToken = async (req: CustomRequest, res: Response) => {
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const user = await this.userService.getUserById(userId);
      const tokens = user?.tokens;
  
      if (tokens !== undefined) {
        res.status(200).json({ tokens });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(`Error fetching user tokens: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
}

export default UserController;
