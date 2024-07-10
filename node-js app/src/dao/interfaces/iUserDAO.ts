import { UserAttributes, UserCreationAttributes } from '../../models/user';

/**
 * Interface defining methods for Data Access Object (DAO) operations related to User.
 * These methods outline CRUD (Create, Read, Update, Delete) operations for user records.
 */
interface IUserDAO {
  /**
   * Creates a new user record in the database.
   * @param user - The attributes of the user to create.
   * @returns A promise that resolves with the created user attributes.
   */
  create(user: UserCreationAttributes): Promise<UserAttributes>;

  /**
   * Retrieves all user records from the database.
   * @returns A promise that resolves with an array of user attributes.
   */
  findAll(): Promise<UserAttributes[]>;

  /**
   * Retrieves a user record by its ID from the database.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves with the found user attributes or null if not found.
   */
  findById(id: number): Promise<UserAttributes | null>;

  /**
   * Retrieves a user record by its email address from the database.
   * @param email - The email address of the user to find.
   * @returns A promise that resolves with the found user attributes or null if not found.
   */
  findByEmail(email: string): Promise<UserAttributes | null>;

  /**
   * Retrieves user records based on the specified role from the database.
   * @param role - The role to search for.
   * @returns A promise that resolves with an array of user attributes or null if none are found.
   */
  findByRole(role: string): Promise<UserAttributes[] | null>;

  /**
   * Updates a user record by its ID in the database with partial updates.
   * @param id - The ID of the user to update.
   * @param updates - The partial user attributes to update.
   * @returns A promise that resolves with true if the user was updated successfully, false otherwise.
   */
  update(id: number, updates: Partial<UserAttributes>): Promise<boolean>;

  /**
   * Deletes a user record by its ID from the database.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves with true if the user was deleted successfully, false otherwise.
   */
  delete(id: number): Promise<boolean>;
}

export default IUserDAO; // Export the IUserDAO interface
