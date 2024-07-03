import { IRepository } from '../IRepository';
import User from '../../models/User';
import { UserAttributes } from '../../models/User';

export class UserRepositoryImpl implements IRepository<UserAttributes> {
  async findAll(): Promise<UserAttributes[]> {
    return User.findAll();
  }

  async findById(id: number): Promise<UserAttributes | null> {
    return User.findByPk(id);
  }

  async create(user: Partial<UserAttributes>): Promise<UserAttributes> {
    return User.create(user as UserAttributes);
  }

  async update(id: number, user: Partial<UserAttributes>): Promise<UserAttributes | null> {
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
