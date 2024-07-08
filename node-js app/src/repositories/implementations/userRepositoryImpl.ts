import UserDAO from '../../dao/implementations/userDAOImpl';
import IUserDAO from '../../dao/interfaces/iUserDAO';
import { UserCreationAttributes, UserAttributes } from '../../models/user';
import IUserRepository from '../interfaces/iUserRepository';


class UserRepository implements IUserRepository{
  private static instance: UserRepository;
  private userDAO: IUserDAO;

  private constructor() {
    this.userDAO = UserDAO.getInstance();
  }

  static getInstance(){
    if (!this.instance) {
      this.instance = new UserRepository();
    }
    return this.instance;
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
