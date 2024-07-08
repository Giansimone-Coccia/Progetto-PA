import { ContentAttributes } from '../models/content';
import Dataset, { DatasetAttributes, DatasetCreationAttributes } from '../models/dataset';
import IDatasetRepository from '../repositories/interfaces/iDatasetRepository';

export class DatasetService {
  private static instance: DatasetService;
  private datasetRepository: IDatasetRepository;

  private constructor(datasetRepository: IDatasetRepository) {
    this.datasetRepository = datasetRepository;
  }

  static getInstance(datasetRepository: IDatasetRepository): DatasetService {
    if (!DatasetService.instance) {
      DatasetService.instance = new DatasetService(datasetRepository);
    }
    return DatasetService.instance;
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

  async getDatasetWithSameName(name: string, userId: number ): Promise<DatasetAttributes[]> {
    return this.datasetRepository.datasetWithSameName(name, userId);
  }

  static createContentHash(content: ContentAttributes) {
    return `${content.type}-${content.data}-${content.cost}`;
  };
}
