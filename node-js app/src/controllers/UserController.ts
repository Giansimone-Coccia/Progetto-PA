import { Response } from 'express';
import { CustomRequest } from '../middleware/authMiddleware'; // Importa il tipo CustomRequest
import { UserService } from '../services/UserService';
import UserDAO from '../dao/Implementations/UserDAOImpl';
import UserRepositoryImpl from '../repositories/Implementations/UserRepositoryImpl';

const userDAO = new UserDAO()
const userRepository = new UserRepositoryImpl(userDAO);
const userService = new UserService(userRepository);

export const getAllUsers = async (req: CustomRequest, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUserById = async (req: CustomRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await userService.getUserById(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const createUser = async (req: CustomRequest, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await userService.updateUser(id, req.body);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const deleteUser = async (req: CustomRequest, res: Response) => {
  const id = Number(req.params.id);
  const success = await userService.deleteUser(id);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
