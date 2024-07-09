import { UserAttributes, UserCreationAttributes } from '../../models/user';

// Interface defining methods for interacting with user entities
interface IUserRepository {
  /**
   * Method to create a new user entity.
   * @param user - The attributes of the user to create.
   * @returns Promise resolved with the created UserAttributes.
   */
  create(user: UserCreationAttributes): Promise<UserAttributes>;

  /**
   * Method to retrieve all user entities.
   * @returns Promise resolved with an array of UserAttributes.
   */
  findAll(): Promise<UserAttributes[]>;

  /**
   * Method to find a user entity by its ID.
   * @param id - The ID of the user entity to retrieve.
   * @returns Promise resolved with the found UserAttributes or null if not found.
   */
  findById(id: number): Promise<UserAttributes | null>;

  /**
   * Method to find a user entity by its email.
   * @param email - The email of the user entity to retrieve.
   * @returns Promise resolved with the found UserAttributes or null if not found.
   */
  findByEmail(email: string): Promise<UserAttributes | null>;

  /**
   * Method to update a user entity by its ID with partial updates.
   * @param id - The ID of the user entity to update.
   * @param updates - The partial user attributes to update.
   * @returns Promise resolved with true if update is successful, false otherwise.
   */
  update(id: number, updates: Partial<UserAttributes>): Promise<boolean>;

  /**
   * Method to delete a user entity by its ID.
   * @param id - The ID of the user entity to delete.
   * @returns Promise resolved with true if deletion is successful, false otherwise.
   */
  delete(id: number): Promise<boolean>;
}

// Export the IUserRepository interface as the default export
export default IUserRepository;
