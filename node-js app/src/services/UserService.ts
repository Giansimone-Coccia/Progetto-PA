import User, { UserAttributes, UserCreationAttributes } from '../models/User';
import IUserRepository from '../repositories/Interfaces/IUserRepository';

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<UserAttributes[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<UserAttributes | null> {
    return this.userRepository.findById(id);
  }

  async createUser(user: UserCreationAttributes): Promise<UserAttributes> {
    return this.userRepository.create(user);
  }

  async updateUser(id: number, user: Partial<UserAttributes>): Promise<boolean> {
    return this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
