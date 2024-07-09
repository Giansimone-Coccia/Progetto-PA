import User, { UserAttributes, UserCreationAttributes } from '../../models/user';
import IUserDAO from '../interfaces/iUserDAO';

/**
 * Data Access Object (DAO) class for interacting with user records.
 * Implements methods to create, read, update, and delete users.
 */
class UserDAO implements IUserDAO {

  private static instance: UserDAO; // Singleton instance of UserDAO

  /**
   * Private constructor to enforce the Singleton pattern.
   * Use UserDAO.getInstance() to obtain the singleton instance.
   */
  private constructor() {
  }

  /**
   * Static method to get the singleton instance of UserDAO.
   * @returns The singleton instance of UserDAO.
   */
  public static getInstance(): UserDAO {
    if (!UserDAO.instance) {
      UserDAO.instance = new UserDAO();
    }
    return UserDAO.instance;
  }

  /**
   * Creates a new user record in the database.
   * @param user - The attributes of the user to create.
   * @returns A promise that resolves with the created user attributes.
   */
  async create(user: UserCreationAttributes): Promise<UserAttributes> {
    const newUser = await User.create(user); // Create the new user
    return newUser.toJSON() as UserAttributes; // Return the created user as JSON
  }

  /**
   * Finds all user records in the database.
   * @returns A promise that resolves with an array of user attributes.
   */
  async findAll(): Promise<UserAttributes[]> {
    const users = await User.findAll(); // Find all users
    return users.map(user => user.toJSON() as UserAttributes); // Map and return the users as JSON
  }  

  /**
   * Finds a user record by its ID in the database.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves with the found user attributes or null if not found.
   */
  async findById(id: number): Promise<UserAttributes | null> {
    const user = await User.findByPk(id); // Find user by primary key (ID)
    return user ? user.toJSON() as UserAttributes : null; // Return the user as JSON or null if not found
  }

  /**
   * Finds a user record by its email in the database.
   * @param email - The email of the user to find.
   * @returns A promise that resolves with the found user attributes or null if not found.
   */
  async findByEmail(email: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { email } }); // Find user by email
    return user ? user.toJSON() as UserAttributes : null; // Return the user as JSON or null if not found
  }

  /**
   * Updates a user record by its ID in the database.
   * @param id - The ID of the user to update.
   * @param updates - The partial user attributes to update.
   * @returns A promise that resolves with true if the user was updated successfully, false otherwise.
   */
  async update(id: number, updates: Partial<UserAttributes>): Promise<boolean> {
    const [updatedRows] = await User.update(updates, { where: { id } }); // Update user by ID
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }

  /**
   * Deletes a user record by its ID from the database.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves with true if the user was deleted successfully, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    const deletedRows = await User.destroy({ where: { id } }); // Delete user by ID
    return deletedRows > 0; // Return true if rows were deleted, false otherwise
  }
}

export default UserDAO; // Export the UserDAO class
