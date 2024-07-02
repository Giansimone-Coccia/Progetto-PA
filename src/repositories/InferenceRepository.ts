import Inference from '../models/Inference';

export interface IInferenceRepository {
  findAll(): Promise<Inference[]>;
  findById(id: number): Promise<Inference | null>;
  create(inference: Partial<Inference>): Promise<Inference>;
  update(id: number, inference: Partial<Inference>): Promise<Inference | null>;
  delete(id: number): Promise<boolean>;
}
