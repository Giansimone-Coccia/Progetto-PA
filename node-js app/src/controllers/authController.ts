import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

// Definition of the AuthController class for managing authentication
class AuthController {
  private static instance: AuthController;  // Singleton instance of the class
  private userService: UserService;         // Service for managing users
  private secret: string;                   // Secret for signing JWT tokens

  // Private constructor to implement the Singleton pattern
  private constructor() {
    this.userService = UserService.getInstance();  // Get the singleton instance of UserService
    this.secret = process.env.JWT_SECRET || 'your_jwt_secret';  // Retrieve the secret from the configuration file
  }

  // Static method to get the singleton instance of AuthController
  public static getInstance(): AuthController {
    if (!this.instance) {
      this.instance = new AuthController();
    }
    return this.instance;
  }

  // Method for registering a new user
  public register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;  // Extract data from the request

    // Check if the required data is present
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create a new user through the UserService
      const newUser = await this.userService.createUser({ email, password: hashedPassword, role });
      res.status(201).json(newUser);  // Respond with the newly created user
    } catch (error) {
      res.status(500).json({ error: 'User already exists' });  // Error handling
    }
  };

  // Method for user login
  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;  // Extract data from the request

    // Check if the required data is present
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find the user through the UserService
    const user = await this.userService.findUserByEmail(email);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the entered password with the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the password is valid
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create a JWT token with the user's data
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, this.secret, {
      expiresIn: '1h',  // Token expiration time
    });

    // Respond with the generated token
    res.json({ token });
  };
}

// Export the AuthController class
export default AuthController;
