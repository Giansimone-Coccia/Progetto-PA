import { Response } from 'express';
import { CustomRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';

/**
 * Controller class for managing user operations.
 * Provides methods for CRUD operations on users and user-specific actions.
 */
class UserController {
  private userService: UserService; // Service for managing user-related operations
  private static instance: UserController; // Singleton instance of the class

  /**
   * Private constructor to implement the Singleton pattern.
   * Initializes UserService instance.
   */
  private constructor() {
    this.userService = UserService.getInstance(); // Get the singleton instance of UserService
  }

  /**
   * Static method to get the singleton instance of UserController.
   * @returns The singleton instance of UserController.
   */
  public static getInstance(): UserController {
    if (!this.instance) {
      this.instance = new UserController();
    }
    return this.instance;
  }

  /**
   * Controller method to get all users.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with all users retrieved from the database.
   */
  public getAllUsers = async (req: CustomRequest, res: Response) => {
    const users = await this.userService.getAllUsers();
    res.json(users);
  };

  /**
   * Controller method to get a user by ID.
   * @param req - The Express request object containing the user ID.
   * @param res - The Express response object.
   * @returns A JSON response with the user retrieved by their ID or an error message if not found.
   */
  public getUserById = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await this.userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  /**
   * Controller method to create a new user.
   * @param req - The Express request object containing user data.
   * @param res - The Express response object.
   * @returns A JSON response with the newly created user or an error message if creation fails.
   */
  public createUser = async (req: CustomRequest, res: Response) => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  };

  /**
   * Controller method to update a user.
   * @param req - The Express request object containing user data.
   * @param res - The Express response object.
   * @returns A JSON response with the updated user or an error message if update fails.
   */
  public updateUser = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const user = await this.userService.updateUser(id, req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  /**
   * Controller method to delete a user.
   * @param req - The Express request object containing user ID.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of user deletion.
   */
  public deleteUser = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const success = await this.userService.deleteUser(id);
    if (success) {
      res.status(204).end(); // Successfully deleted, no content to return
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };

  /**
   * Controller method to get the token of the current user.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the tokens of the current user or an error message if retrieval fails.
   */
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

  /**
   * Controller method to recharge user credits (tokens).
   * @param req - The Express request object containing email and token data.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of token recharge operation.
   */
  public creditRecharge = async (req: CustomRequest, res: Response) => {
    const emailUser = req.body.emailUser;
    const tokenUser = req.body.tokenUser;

    // Check if the email is provided
    if (!emailUser) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if the token value is provided
    if (tokenUser === null || tokenUser === undefined) {
      return res.status(400).json({ message: 'Token value is required' });
    }

    try {
      // Find the user by email
      const user = await this.userService.findUserByEmail(emailUser);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userId = user.id;

      if (!Number.isInteger(userId)) {
        return res.status(500).json({ message: 'Invalid user ID' });
      }

      // Calculate the new token value
      const newTokensValue = user.tokens + Number(tokenUser);

      // Update the user's tokens
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

// Export the UserController class
export default UserController;
