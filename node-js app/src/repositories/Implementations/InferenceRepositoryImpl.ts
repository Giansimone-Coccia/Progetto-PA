import { IRepository } from '../Interfaces/IRepository';
import Inference from '../../models/Inference';

export class InferenceRepositoryImpl implements IRepository<Inference> {
  async findAll(): Promise<Inference[]> {
    return Inference.findAll();
  }

  async findById(id: number): Promise<Inference | null> {
    return Inference.findByPk(id);
  }

  async create(inference: Partial<Inference>): Promise<Inference> {
    return Inference.create(inference as Inference);
  }

  async update(id: number, inference: Partial<Inference>): Promise<Inference | null> {
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
