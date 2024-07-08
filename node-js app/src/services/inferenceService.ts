import Inference, { InferenceAttributes, InferenceCreationAttributes } from '../models/inference';
import IInferenceRepository from '../repositories/interfaces/iInferenceRepository';

export class InferenceService {
  private static instance: InferenceService;
  private inferenceRepository: IInferenceRepository;

  private constructor(inferenceRepository: IInferenceRepository) {
    this.inferenceRepository = inferenceRepository;
  }

  static getInstance(inferenceRepository: IInferenceRepository): InferenceService {
    if (!InferenceService.instance) {
      InferenceService.instance = new InferenceService(inferenceRepository);
    }
    return InferenceService.instance;
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
