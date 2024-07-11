import { UserAttributes, UserCreationAttributes } from '../models/user'; // Importing User model
import UserRepository from '../repositories/implementations/userRepositoryImpl'; // Importing User repository implementation
import IUserRepository from '../repositories/interfaces/iUserRepository'; // Importing User repository interface

/**
 * Service class for managing user-related operations.
 */
export class UserService {
  private static instance: UserService;
  private userRepository: IUserRepository;

  /**
   * Private constructor initializes UserRepository instance.
   */
  private constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  /**
   * Retrieves the singleton instance of UserService.
   * @returns The singleton instance of UserService.
   */
  static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }

  /**
   * Retrieves all users from the repository.
   * @returns A promise that resolves to an array of UserAttributes.
   */
  async getAllUsers(): Promise<UserAttributes[]> {
    return this.userRepository.findAll();
  }

  /**
   * Retrieves user by ID from the repository.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to UserAttributes if found, otherwise null.
   */
  async getUserById(id: number): Promise<UserAttributes | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Finds a user by email using Sequelize findOne method.
   * @param email - The email of the user to find.
   * @returns A promise that resolves to UserAttributes if found, otherwise null.
   */
  async getUserByEmail(email: string): Promise<UserAttributes | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
 * Retrieves user records based on the specified role from the database.
 * @param role - The role to search for.
 * @returns A promise that resolves with an array of user attributes or null if none are found.
 */
  async findByRole(role: string): Promise<UserAttributes[] | null> {
    return this.userRepository.findByRole(role); // Call DAO method to find users by role
  }

  /**
   * Creates new user in the repository.
   * @param user - The user data to create.
   * @returns A promise that resolves to the created UserAttributes.
   */
  async createUser(user: UserCreationAttributes): Promise<UserAttributes> {
    return this.userRepository.create(user);
  }

  /**
   * Updates existing user in the repository.
   * @param id - The ID of the user to update.
   * @param user - The partial user data to update.
   * @returns A promise that resolves to true if update was successful, otherwise false.
   */
  async updateUser(id: number, user: Partial<UserAttributes>): Promise<boolean> {
    return this.userRepository.update(id, user);
  }

  /**
   * Deletes user from the repository.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  /**
   * Retrieves the first user with the role "admin" from the repository.
   * @returns A promise that resolves to UserAttributes if an admin user is found, otherwise null.
   */
  async getAdmin(): Promise<UserAttributes | null> {
    // Call the repository method to find users with the role "admin"
    const users = await this.findByRole("admin");

    // Check if users array is not null and contains at least one user
    if (users && users.length > 0) {
      return users[0]; // Return the first admin user found
    }

    return null; // Return null if no admin user is found
  }
}
