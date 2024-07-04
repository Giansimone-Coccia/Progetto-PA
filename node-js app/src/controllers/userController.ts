import { Response } from 'express';
import { CustomRequest } from '../middleware/authMiddleware'; // Import the CustomRequest type
import { UserService } from '../services/userService';
import UserDAO from '../dao/implementations/userDAOImpl';
import UserRepositoryImpl from '../repositories/implementations/userRepositoryImpl';

class UserController {
  private userService: UserService;

  constructor() {
    const userDAO = new UserDAO();
    const userRepository = new UserRepositoryImpl(userDAO);
    this.userService = new UserService(userRepository);
  }

  getAllUsers = async (req: CustomRequest, res: Response) => {
    const users = await this.userService.getAllUsers();
    res.json(users);
  };

  getUserById = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await this.userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  createUser = async (req: CustomRequest, res: Response) => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  };

  updateUser = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await this.userService.updateUser(id, req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  deleteUser = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const success = await this.userService.deleteUser(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };
}

export default UserController;
