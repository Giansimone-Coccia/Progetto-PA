import { IRepository } from '../repositories/Interfaces/IRepository';
import User from '../models/User';

export class UserService {
  private userRepository: IRepository<User>;

  constructor(userRepository: IRepository<User>) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(user: Partial<User>): Promise<User> {
    return this.userRepository.create(user);
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    return this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
