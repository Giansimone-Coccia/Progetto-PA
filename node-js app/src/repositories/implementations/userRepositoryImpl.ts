import UserDAO from '../../dao/implementations/userDAOImpl'; // Import the concrete implementation of user DAO
import IUserDAO from '../../dao/interfaces/iUserDAO'; // Import the interface for user DAO
import { UserCreationAttributes, UserAttributes } from '../../models/user'; // Import user attributes and creation attributes
import IUserRepository from '../interfaces/iUserRepository'; // Import interface for user repository

// Repository class implementing IUserRepository interface
class UserRepository implements IUserRepository {
  private static instance: UserRepository; // Static instance of UserRepository
  private userDAO: IUserDAO; // Instance of user DAO interface

  // Private constructor to initialize user DAO instance
  private constructor() {
    this.userDAO = UserDAO.getInstance(); // Get singleton instance of UserDAO
  }

  /**
   * Singleton pattern: Get instance of UserRepository.
   * @returns The singleton instance of UserRepository.
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new UserRepository(); // Create new instance if not exists
    }
    return this.instance; // Return existing instance
  }

  /**
   * Creates a user using user DAO.
   * @param user - The user creation attributes.
   * @returns Promise resolved with the created UserAttributes.
   */
  async create(user: UserCreationAttributes): Promise<UserAttributes> {
    return this.userDAO.create(user); // Call DAO method to create user
  }

  /**
   * Retrieves all users using user DAO.
   * @returns Promise resolved with an array of UserAttributes.
   */
  async findAll(): Promise<UserAttributes[]> {
    return this.userDAO.findAll(); // Call DAO method to find all users
  }

  /**
   * Retrieves user by ID using user DAO.
   * @param id - The ID of the user to retrieve.
   * @returns Promise resolved with the found UserAttributes or null if not found.
   */
  async findById(id: number): Promise<UserAttributes | null> {
    return this.userDAO.findById(id); // Call DAO method to find user by ID
  }

  /**
   * Retrieves user by email using user DAO.
   * @param email - The email of the user to retrieve.
   * @returns Promise resolved with the found UserAttributes or null if not found.
   */
  async findByEmail(email: string): Promise<UserAttributes | null> {
    return this.userDAO.findByEmail(email); // Call DAO method to find user by email
  }


  /**
   * Retrieves user records based on the specified role from the database.
   * @param role - The role to search for.
   * @returns A promise that resolves with an array of user attributes or null if none are found.
   */
  async findByRole(role: string): Promise<UserAttributes[] | null> {
    return this.userDAO.findByRole(role); // Call DAO method to find users by role
  }

  /**
   * Updates user by ID with partial updates using user DAO.
   * @param id - The ID of the user to update.
   * @param updates - The partial user attributes to update.
   * @returns Promise resolved with true if update is successful, false otherwise.
   */
  async update(id: number, updates: Partial<UserAttributes>): Promise<boolean> {
    return this.userDAO.update(id, updates); // Call DAO method to update user
  }

  /**
   * Deletes user by ID using user DAO.
   * @param id - The ID of the user to delete.
   * @returns Promise resolved with true if deletion is successful, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    return this.userDAO.delete(id); // Call DAO method to delete user
  }
}

// Export UserRepository class as default export
export default UserRepository;
