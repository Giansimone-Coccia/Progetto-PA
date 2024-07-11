import { ContentAttributes } from '../models/content';
import { DatasetAttributes, DatasetCreationAttributes } from '../models/dataset';
import DatasetRepository from '../repositories/implementations/datasetRepositoryImpl';
import IDatasetRepository from '../repositories/interfaces/iDatasetRepository';

/**
 * Service class for managing dataset-related operations.
 */
export class DatasetService {
  private static instance: DatasetService;
  private datasetRepository: IDatasetRepository;

  /**
   * Private constructor initializes DatasetRepository instance.
   */
  private constructor() {
    this.datasetRepository = DatasetRepository.getInstance();
  }

  /**
   * Retrieves the singleton instance of DatasetService.
   * @returns The singleton instance of DatasetService.
   */
  static getInstance(): DatasetService {
    if (!this.instance) {
      this.instance = new DatasetService();
    }
    return this.instance;
  }

  /**
   * Retrieves all datasets from the repository.
   * @returns A promise that resolves to an array of DatasetAttributes.
   */
  async getAllDatasets(): Promise<DatasetAttributes[]> {
    return this.datasetRepository.findAll();
  }

  /**
   * Retrieves dataset by ID from the repository.
   * @param id - The ID of the dataset to retrieve.
   * @returns A promise that resolves to DatasetAttributes if found, otherwise null.
   */
  async getDatasetById(id: number): Promise<DatasetAttributes | null> {
    return this.datasetRepository.findById(id);
  }

  /**
   * Creates new dataset in the repository.
   * @param dataset - The dataset data to create.
   * @returns A promise that resolves to the created DatasetAttributes.
   */
  async createDataset(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    return this.datasetRepository.create(dataset);
  }

  /**
   * Updates existing dataset in the repository.
   * @param id - The ID of the dataset to update.
   * @param dataset - The partial dataset data to update.
   * @returns A promise that resolves to true if update was successful, otherwise false.
   */
  async updateDataset(id: number, dataset: Partial<DatasetAttributes>): Promise<boolean> {
    return this.datasetRepository.update(id, dataset);
  }

  /**
   * Deletes dataset from the repository.
   * @param id - The ID of the dataset to delete.
   * @returns A promise that resolves to true if deletion was successful, otherwise false.
   */
  async deleteDataset(id: number): Promise<boolean> {
    return this.datasetRepository.delete(id);
  }

  /**
   * Retrieves datasets with the same name and user ID from the repository.
   * @param name - The name of the dataset to search for.
   * @param userId - The ID of the user who owns the datasets.
   * @returns A promise that resolves to an array of DatasetAttributes matching the criteria.
   */
  async getDatasetWithSameName(name: string, userId: number): Promise<DatasetAttributes[]> {
    return this.datasetRepository.datasetWithSameName(name, userId);
  }

  /**
   * Creates a hash string based on content attributes for identification.
   * @param content - The content attributes used to generate the hash.
   * @returns A string hash representing the content type, data, and cost.
   */
  createContentHash(content: ContentAttributes): string {
    return `${content.type}-${content.data}-${content.cost}`;
  }

  /**
   * Retrieves all datasets for a specific user by their user ID.
   * @param userId - The ID of the user whose datasets are to be retrieved.
   * @returns A promise that resolves to an array of dataset attributes.
   */
  async getDatasetByUserId(userId: number): Promise<DatasetAttributes[]> {
    return this.datasetRepository.getDatasetsByUserId(userId);
  }
}
