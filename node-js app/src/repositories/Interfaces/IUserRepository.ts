import { UserAttributes, UserCreationAttributes } from '../../models/User';

interface IUserRepository {
  create(user: UserCreationAttributes): Promise<UserAttributes>;
  findAll(): Promise<UserAttributes[]>;
  findById(id: number): Promise<UserAttributes | null>;
  findByEmail(email: string): Promise<UserAttributes | null>;
  update(id: number, updates: Partial<UserAttributes>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

export default IUserRepository;
