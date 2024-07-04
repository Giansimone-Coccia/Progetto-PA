import Inference, { InferenceAttributes, InferenceCreationAttributes } from '../models/Inference';
import IInferenceRepository from '../repositories/Interfaces/IInferenceRepository';

export class InferenceService {
  private inferenceRepository: IInferenceRepository;

  constructor(inferenceRepository: IInferenceRepository) {
    this.inferenceRepository = inferenceRepository;
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
