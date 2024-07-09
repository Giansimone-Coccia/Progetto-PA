import { UserAttributes, UserCreationAttributes } from '../../models/user';

// Interface defining methods for Data Access Object (DAO) operations related to User
interface IUserDAO {
  // Method to create a new user record
  create(user: UserCreationAttributes): Promise<UserAttributes>;

  // Method to find all user records
  findAll(): Promise<UserAttributes[]>;

  // Method to find a user record by its ID
  findById(id: number): Promise<UserAttributes | null>;

  // Method to find a user record by its email address
  findByEmail(email: string): Promise<UserAttributes | null>;

  // Method to update a user record by its ID with partial updates
  update(id: number, updates: Partial<UserAttributes>): Promise<boolean>;

  // Method to delete a user record by its ID
  delete(id: number): Promise<boolean>;
}

export default IUserDAO; // Export the IUserDAO interface
