import { Response, NextFunction } from 'express';
import { CustomRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';
import { StatusCodes } from 'http-status-codes';
import ErrorFactory from '../error/errorFactory';

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
  public getAllUsers = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve users'));
    }
  };

  /**
   * Controller method to get a user by ID.
   * @param req - The Express request object containing the user ID.
   * @param res - The Express response object.
   * @returns A JSON response with the user retrieved by their ID or an error message if not found.
   */
  public getUserById = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    try {
      const user = await this.userService.getUserById(id);
      if (user) {
        res.json(user);
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'User not found'));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch user'));
    }
  };

  /**
   * Controller method to create a new user.
   * @param req - The Express request object containing user data.
   * @param res - The Express response object.
   * @returns A JSON response with the newly created user or an error message if creation fails.
   */
  public createUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create user'));
    }
  };

  /**
   * Controller method to update a user.
   * @param req - The Express request object containing user data.
   * @param res - The Express response object.
   * @returns A JSON response with the updated user or an error message if update fails.
   */
  public updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    try {
      const user = await this.userService.updateUser(id, req.body);
      if (user) {
        res.json(user);
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'User not found'));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update user'));
    }
  };

  /**
   * Controller method to delete a user.
   * @param req - The Express request object containing user ID.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of user deletion.
   */
  public deleteUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    try {
      const success = await this.userService.deleteUser(id);
      if (success) {
        res.status(StatusCodes.NO_CONTENT).end(); // Successfully deleted, no content to return
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'User not found'));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete user'));
    }
  };

  /**
   * Controller method to get the token of the current user.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the tokens of the current user or an error message if retrieval fails.
   */
  public getToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
    }

    try {
      const user = await this.userService.getUserById(userId);
      const tokens = user?.tokens;

      if (tokens !== undefined) {
        res.status(StatusCodes.OK).json({ tokens });
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'User not found'));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch user tokens'));
    }
  };

  /**
   * Controller method to recharge user credits (tokens).
   * @param req - The Express request object containing email and token data.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of token recharge operation.
   */
  public creditRecharge = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const emailUser = req.body.emailUser;
    const tokenUser = req.body.tokenUser;

    // Check if the email is provided
    if (!emailUser) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Email is required'));
    }

    // Check if the token value is provided
    if (tokenUser === null || tokenUser === undefined) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Token value is required'));
    }

    try {
      // Find the user by email
      const user = await this.userService.getUserByEmail(emailUser);

      if (!user) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'User not found'));
      }

      const userId = user.id;

      if (!Number.isInteger(userId)) {
        return next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Invalid user ID'));
      }

      // Calculate the new token value
      const newTokensValue = user.tokens + Number(tokenUser);

      // Update the user's tokens
      const updateSuccessful = await this.userService.updateUser(userId, { tokens: newTokensValue, updatedAt: new Date()});

      if (updateSuccessful) {
        res.status(StatusCodes.OK).json({ message: `Tokens updated successfully. New token value: ${newTokensValue}` });
      } else {
        return next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update user tokens'));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating user tokens'));
    }
  };
}

// Export the UserController class
export default UserController;
