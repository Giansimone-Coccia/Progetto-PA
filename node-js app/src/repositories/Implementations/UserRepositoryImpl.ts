import IUserDAO from '../../dao/Interfaces/IUserDAO';
import { UserCreationAttributes, UserAttributes } from '../../models/User';
import IUserRepository from '../Interfaces/IUserRepository';


class UserRepository implements IUserRepository{
  private userDAO: IUserDAO;

  constructor(userDAO: IUserDAO) {
    this.userDAO = userDAO;
  }

  async create(user: UserCreationAttributes): Promise<UserAttributes> {
    return this.userDAO.create(user);
  }

  async findAll(): Promise<UserAttributes[]> {
    return this.userDAO.findAll();
  }

  async findById(id: number): Promise<UserAttributes | null> {
    return this.userDAO.findById(id);
  }

  async findByEmail(email: string): Promise<UserAttributes | null> {
    return this.userDAO.findByEmail(email);
  }

  async update(id: number, updates: Partial<UserAttributes>): Promise<boolean> {
    return this.userDAO.update(id, updates);
  }

  async delete(id: number): Promise<boolean> {
    return this.userDAO.delete(id);
  }
}

export default UserRepository;
