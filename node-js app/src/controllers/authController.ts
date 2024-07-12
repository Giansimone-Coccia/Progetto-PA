import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import ErrorFactory from '../error/errorFactory';
import { StatusCodes } from 'http-status-codes';
import { ErrorMessages } from '../error/errorMessages';

/**
 * Controller class for handling authentication operations.
 * Provides methods for user registration and login.
 */
class AuthController {
  private static instance: AuthController;  // Singleton instance of the class
  private readonly userService: UserService;         // Service for managing users
  private readonly secret: string;                   // Secret for signing JWT tokens

  /**
   * Private constructor to implement the Singleton pattern.
   * Initializes UserService instance and JWT secret.
   */
  private constructor() {
    this.userService = UserService.getInstance();  // Get the singleton instance of UserService
    this.secret = process.env.JWT_SECRET || 'your_jwt_secret';  // Retrieve the secret from the configuration file
  }

  /**
   * Static method to get the singleton instance of AuthController.
   * @returns The singleton instance of AuthController.
   */
  public static getInstance(): AuthController {
    if (!this.instance) {
      this.instance = new AuthController();
    }
    return this.instance;
  }

  /**
   * Controller method for registering a new user.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the newly created user or an error message.
   */
  public register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;  // Extract data from the request

    // Check if the required data is present
    if (!email || !password || !role) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.E_P_R_REQUIRED));
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_EMAIL_FORMAT));
    }

    // Validate password format using regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_PASSWORD_FORMAT));
    }

    // Check if role is either "user" or "admin"
    if (role !== "user" && role !== "admin") {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_ROLE));
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Check if an admin already exists when registering as admin
      if (await this.userService.getAdmin() && role === "admin") {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.ADMIN_EXISTS));
      }

      // Create a new user through the UserService
      const newUser = await this.userService.createUser({ email, password: hashedPassword, role });
      res.status(StatusCodes.CREATED).json(newUser);  // Respond with the newly created user
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.USER_EXISTS));
    }
  };

  /**
   * Controller method for user login.
   * @param req - The Express request object containing user credentials.
   * @param res - The Express response object.
   * @returns A JSON response with a JWT token upon successful login or an error message.
   */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;  // Extract data from the request

    // Check if the required data is present
    if (!email || !password) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.E_P_REQUIRE));
    }

    try {
      // Find the user through the UserService
      const user = await this.userService.getUserByEmail(email);

      // Check if the user exists
      if (!user) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, ErrorMessages.USER_NOT_FOUND));
      }

      // Verify the entered password with the stored password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Check if the password is valid
      if (!isPasswordValid) {
        return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, ErrorMessages.INVALID_PASSWORD));
      }

      // Create a JWT token with the user's data
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, this.secret, {
        expiresIn: '1h',  // Token expiration time
      });

      // Respond with the generated token
      res.json({ token });
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.ERROR_OCCURED_LOGIN));
    }
  };
}

// Export the AuthController class as the default export
export default AuthController;
