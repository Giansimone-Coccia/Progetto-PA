import DatasetDAO from '../../dao/implementations/datasetDAOImpl';
import IDatasetDAO from '../../dao/interfaces/iDatasetDAO';
import { DatasetAttributes, DatasetCreationAttributes } from '../../models/dataset';
import IDatasetRepository from '../interfaces/iDatasetRepository';


class DatasetRepository implements IDatasetRepository {
  private static instance: DatasetRepository;
  private datasetDAO: IDatasetDAO;

  private constructor() {
    this.datasetDAO = DatasetDAO.getInstance();
  }

  static getInstance(){
    if (!this.instance) {
      this.instance = new DatasetRepository();
    }
    return this.instance;
  }

  async create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    return this.datasetDAO.create(dataset);
  }

  async findAll(): Promise<DatasetAttributes[]> {
    return this.datasetDAO.findAll();
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

  async datasetWithSameName(name: string, userId: number ): Promise<DatasetAttributes[]> {
    return this.datasetDAO.datasetWithSameName(name, userId);
  }
}

export default DatasetRepository;
