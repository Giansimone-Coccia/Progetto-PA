import { Response } from 'express';
import { CustomRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';

class UserController {
  private userService: UserService;
  private static instance: UserController;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): UserController {
    if (!this.instance) {
      this.instance = new UserController();
    }
    return this.instance;
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

  public creditRecharge = async (req: CustomRequest, res: Response) => {
    const emailUser = req.body.emailUser;
    const tokenUser = req.body.tokenUser;
    console.log(`email: ${emailUser}`);
    console.log(`token: ${tokenUser}`);

    if (!emailUser) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    if (tokenUser == null) { // Check for both null and undefined
      return res.status(400).json({ message: 'Token value is required' });
    }
  
    try {
      const user = await this.userService.findUserByEmail(emailUser);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userId = user.id;
      console.log(`UserID: ${userId}`);
      if (!Number.isInteger(userId)) {
        return res.status(500).json({ message: 'Invalid user ID' });
      }

      const newTokensValue = user.tokens + Number(tokenUser);
  
      const updateSuccessful = await this.userService.updateUser(userId, { tokens: newTokensValue });
  
      if (updateSuccessful) {
        return res.status(200).json({ message: `Operation completed. New token value: ${newTokensValue}` });
      } else {
        return res.status(500).json({ message: 'Failed to update user tokens' });
      }
    } catch (error) {
      console.error(`Error updating user tokens: ${error}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

}

export default UserController;
