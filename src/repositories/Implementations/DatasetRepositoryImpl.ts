import { IRepository } from '../IRepository';
import Dataset from '../../models/Dataset';
import { DatasetAttributes } from '../../models/Dataset';

export class DatasetRepositoryImpl implements IRepository<DatasetAttributes> {
  async findAll(): Promise<DatasetAttributes[]> {
    return Dataset.findAll();
  }

  async findById(id: number): Promise<DatasetAttributes | null> {
    return Dataset.findByPk(id);
  }

  async create(dataset: Partial<DatasetAttributes>): Promise<DatasetAttributes> {
    return Dataset.create(dataset as DatasetAttributes);
  }

  async update(id: number, dataset: Partial<DatasetAttributes>): Promise<DatasetAttributes | null> {
    const existingDataset = await Dataset.findByPk(id);
    if (!existingDataset) {
      return null;
    }
    return existingDataset.update(dataset);
  }

  async delete(id: number): Promise<boolean> {
    const result = await Dataset.destroy({ where: { id } });
    return result > 0;
  }
}
