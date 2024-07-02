import { IInferenceRepository } from '../InferenceRepository';
import Inference from '../../models/Inference';
import { InferenceAttributes } from '../../models/Inference';

export class InferenceRepositoryImpl implements IInferenceRepository {
  async findAll(): Promise<Inference[]> {
    return Inference.findAll();
  }

  async findById(id: number): Promise<Inference | null> {
    return Inference.findByPk(id);
  }

  async create(inference: Partial<InferenceAttributes>): Promise<Inference> {
    return Inference.create(inference as InferenceAttributes);
  }

  async update(id: number, inference: Partial<InferenceAttributes>): Promise<Inference | null> {
    const existingInference = await Inference.findByPk(id);
    if (!existingInference) {
      return null;
    }
    return existingInference.update(inference);
  }

  async delete(id: number): Promise<boolean> {
    const result = await Inference.destroy({ where: { id } });
    return result > 0;
  }
}
