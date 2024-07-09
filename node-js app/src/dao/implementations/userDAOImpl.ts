import User, { UserAttributes, UserCreationAttributes } from '../../models/user';
import IUserDAO from '../interfaces/iUserDAO';

// User Data Access Object (DAO) class
class UserDAO implements IUserDAO {

  private static instance: UserDAO; // Singleton instance of UserDAO

  // Private constructor to enforce the Singleton pattern
  private constructor() {
  }

  // Static method to get the singleton instance of UserDAO
  public static getInstance(): UserDAO {
    if (!UserDAO.instance) {
      UserDAO.instance = new UserDAO();
    }
    return UserDAO.instance;
  }

  // Method to create a new user record
  async create(user: UserCreationAttributes): Promise<UserAttributes> {
    const newUser = await User.create(user); // Create the new user
    return newUser.toJSON() as UserAttributes; // Return the created user as JSON
  }

  // Method to find all user records
  async findAll(): Promise<UserAttributes[]> {
    const users = await User.findAll(); // Find all users
    return users.map(User => User.toJSON() as UserAttributes); // Map and return the users as JSON
  }  

  // Method to find a user record by its ID
  async findById(id: number): Promise<UserAttributes | null> {
    const user = await User.findByPk(id); // Find user by primary key (ID)
    return user ? user.toJSON() as UserAttributes : null; // Return the user as JSON or null if not found
  }

  // Method to find a user record by its email
  async findByEmail(email: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { email } }); // Find user by email
    return user ? user.toJSON() as UserAttributes : null; // Return the user as JSON or null if not found
  }

  // Method to update a user record by its ID
  async update(id: number, updates: Partial<UserAttributes>): Promise<boolean> {
    const [updatedRows] = await User.update(updates, { where: { id } }); // Update user by ID
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }

  // Method to delete a user record by its ID
  async delete(id: number): Promise<boolean> {
    const deletedRows = await User.destroy({ where: { id } }); // Delete user by ID
    return deletedRows > 0; // Return true if rows were deleted, false otherwise
  }
}

export default UserDAO; // Export the UserDAO class
