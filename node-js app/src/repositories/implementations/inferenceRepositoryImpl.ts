import InferenceDAO from '../../dao/implementations/inferenceDAOImpl';
import IInferenceDAO from '../../dao/interfaces/iInferenceDAO';
import { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference';
import IInferenceRepository from '../interfaces/iInferenceRepository';


class InferenceRepository implements IInferenceRepository {
  private static instance: InferenceRepository;
  private inferenceDAO: IInferenceDAO;

  private constructor() {
    this.inferenceDAO = InferenceDAO.getInstance();
  }

  static getInstance(){
    if (!this.instance) {
      this.instance = new InferenceRepository();
    }
    return this.instance;
  }

  async create(inference: InferenceCreationAttributes): Promise<InferenceAttributes> {
    return this.inferenceDAO.create(inference);
  }

  async findAll(): Promise<InferenceAttributes[]> {
    return this.inferenceDAO.findAll();
  }

  async findById(id: number): Promise<InferenceAttributes | null> {
    return this.inferenceDAO.findById(id);
  }

  async update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean> {
    return this.inferenceDAO.update(id, updates);
  }

  async delete(id: number): Promise<boolean> {
    return this.inferenceDAO.delete(id);
  }
}

export default InferenceRepository;
