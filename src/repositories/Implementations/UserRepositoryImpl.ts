import { IRepository } from '../IRepository';
import User from '../../models/User';

export class UserRepositoryImpl implements IRepository<User> {
  async findAll(): Promise<User[]> {
    return User.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async create(user: Partial<User>): Promise<User> {
    return User.create(user as User);
  }

  async update(id: number, user: Partial<User>): Promise<User | null> {
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
