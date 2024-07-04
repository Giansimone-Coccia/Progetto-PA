import Dataset, { DatasetAttributes, DatasetCreationAttributes } from '../models/dataset';
import IDatasetRepository from '../repositories/interfaces/iDatasetRepository';

export class DatasetService {
  private datasetRepository: IDatasetRepository;

  constructor(datasetRepository: IDatasetRepository) {
    this.datasetRepository = datasetRepository;
  }

  async getAllDatasets(): Promise<DatasetAttributes[]> {
    return this.datasetRepository.findAll();
  }

  async getDatasetById(id: number): Promise<DatasetAttributes | null> {
    return this.datasetRepository.findById(id);
  }

  async createDataset(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    return this.datasetRepository.create(dataset);
  }

  async updateDataset(id: number, dataset: Partial<DatasetAttributes>): Promise<boolean> {
    return this.datasetRepository.update(id, dataset);
  }

  async deleteDataset(id: number): Promise<boolean> {
    return this.datasetRepository.delete(id);
  }
}
