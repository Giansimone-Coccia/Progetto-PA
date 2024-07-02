import { IDatasetRepository } from '../repositories/DatasetRepository';
import Dataset from '../models/Dataset';

export class DatasetService {
  private datasetRepository: IDatasetRepository;

  constructor(datasetRepository: IDatasetRepository) {
    this.datasetRepository = datasetRepository;
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return this.datasetRepository.findAll();
  }

  async getDatasetById(id: number): Promise<Dataset | null> {
    return this.datasetRepository.findById(id);
  }

  async createDataset(dataset: Partial<Dataset>): Promise<Dataset> {
    return this.datasetRepository.create(dataset);
  }

  async updateDataset(id: number, dataset: Partial<Dataset>): Promise<Dataset | null> {
    return this.datasetRepository.update(id, dataset);
  }

  async deleteDataset(id: number): Promise<boolean> {
    return this.datasetRepository.delete(id);
  }
}
