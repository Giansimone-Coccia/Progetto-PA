import { IDatasetRepository } from '../DatasetRepository';
import Dataset from '../../models/Dataset';
import { DatasetAttributes } from '../../models/Dataset';

export class DatasetRepositoryImpl implements IDatasetRepository {
  async findAll(): Promise<Dataset[]> {
    return Dataset.findAll();
  }

  async findById(id: number): Promise<Dataset | null> {
    return Dataset.findByPk(id);
  }

  async create(dataset: Partial<DatasetAttributes>): Promise<Dataset> {
    return Dataset.create(dataset as DatasetAttributes);
  }

  async update(id: number, dataset: Partial<DatasetAttributes>): Promise<Dataset | null> {
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
