import { IUserRepository } from '../UserRepository';
import User from '../../models/User';
import { UserAttributes } from '../../models/User';

export class UserRepositoryImpl implements IUserRepository {
  async findAll(): Promise<User[]> {
    return User.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async create(user: Partial<UserAttributes>): Promise<User> {
    return User.create(user as UserAttributes);
  }

  async update(id: number, user: Partial<UserAttributes>): Promise<User | null> {
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return null;
    }
    return existingUser.update(user);
  }

  async delete(id: number): Promise<boolean> {
    const result = await User.destroy({ where: { id } });
    return result > 0;
  }
}
