import IDatasetDAO from '../../dao/Interfaces/IDatasetDAO';
import { DatasetAttributes, DatasetCreationAttributes } from '../../models/Dataset';
import IDatasetRepository from '../Interfaces/IDatasetRepository';


class DatasetRepository implements IDatasetRepository {
  private datasetDAO: IDatasetDAO;

  constructor(datasetDAO: IDatasetDAO) {
    this.datasetDAO = datasetDAO;
  }

  async create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    return this.datasetDAO.create(dataset);
  }

  async findById(id: number): Promise<DatasetAttributes | null> {
    return this.datasetDAO.findById(id);
  }

  async update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean> {
    return this.datasetDAO.update(id, updates);
  }

  async delete(id: number): Promise<boolean> {
    return this.datasetDAO.delete(id);
  }
}

export default DatasetRepository;
