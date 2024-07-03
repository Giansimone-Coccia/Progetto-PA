import { IRepository } from '../repositories/IRepository';
import Inference from '../models/Inference';

export class InferenceService {
  private inferenceRepository: IRepository<Inference>;

  constructor(inferenceRepository: IRepository<Inference>) {
    this.inferenceRepository = inferenceRepository;
  }

  async getAllInferences(): Promise<Inference[]> {
    return this.inferenceRepository.findAll();
  }

  async getInferenceById(id: number): Promise<Inference | null> {
    return this.inferenceRepository.findById(id);
  }

  async createInference(inference: Partial<Inference>): Promise<Inference> {
    return this.inferenceRepository.create(inference);
  }

  async updateInference(id: number, inference: Partial<Inference>): Promise<Inference | null> {
    return this.inferenceRepository.update(id, inference);
  }

  async deleteInference(id: number): Promise<boolean> {
    return this.inferenceRepository.delete(id);
  }
}
