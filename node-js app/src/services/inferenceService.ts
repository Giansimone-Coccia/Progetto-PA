import { InferenceAttributes, InferenceCreationAttributes } from '../models/inference';
import InferenceRepository from '../repositories/implementations/inferenceRepositoryImpl';
import IInferenceRepository from '../repositories/interfaces/iInferenceRepository';

export class InferenceService {
  private static instance: InferenceService;
  private inferenceRepository: IInferenceRepository;

  constructor() {
    this.inferenceRepository = InferenceRepository.getInstance();
  }

  static getInstance(): InferenceService {
    if (!this.instance) {
      this.instance = new InferenceService();
    }
    return this.instance;
  }

  async getAllInferences(): Promise<InferenceAttributes[]> {
    return this.inferenceRepository.findAll();
  }

  async getInferenceById(id: number): Promise<InferenceAttributes | null> {
    return this.inferenceRepository.findById(id);
  }

  async createInference(inference: InferenceCreationAttributes): Promise<InferenceAttributes> {
    return this.inferenceRepository.create(inference);
  }

  async updateInference(id: number, inference: Partial<InferenceAttributes>): Promise<boolean> {
    return this.inferenceRepository.update(id, inference);
  }

  async deleteInference(id: number): Promise<boolean> {
    return this.inferenceRepository.delete(id);
  }
}
