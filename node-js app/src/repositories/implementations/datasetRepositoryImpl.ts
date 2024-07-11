import DatasetDAO from '../../dao/implementations/datasetDAOImpl'; // Import the concrete implementation of dataset DAO
import IDatasetDAO from '../../dao/interfaces/iDatasetDAO'; // Import the interface for dataset DAO
import { DatasetAttributes, DatasetCreationAttributes } from '../../models/dataset'; // Import dataset attributes and creation attributes
import IDatasetRepository from '../interfaces/iDatasetRepository'; // Import interface for dataset repository

// Repository class implementing IDatasetRepository interface
class DatasetRepository implements IDatasetRepository {
  private static instance: DatasetRepository; // Static instance of DatasetRepository
  private datasetDAO: IDatasetDAO; // Instance of dataset DAO interface

  // Private constructor to initialize dataset DAO instance
  private constructor() {
    this.datasetDAO = DatasetDAO.getInstance(); // Get singleton instance of DatasetDAO
  }

  /**
   * Singleton pattern: Get instance of DatasetRepository.
   * @returns The singleton instance of DatasetRepository.
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new DatasetRepository(); // Create new instance if not exists
    }
    return this.instance; // Return existing instance
  }

  /**
   * Creates a dataset using dataset DAO.
   * @param dataset - The dataset creation attributes.
   * @returns Promise resolved with the created dataset attributes.
   */
  async create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    return this.datasetDAO.create(dataset); // Call DAO method to create dataset
  }

  /**
   * Retrieves all datasets using dataset DAO.
   * @returns Promise resolved with an array of DatasetAttributes.
   */
  async findAll(): Promise<DatasetAttributes[]> {
    return this.datasetDAO.findAll(); // Call DAO method to find all datasets
  }

  /**
   * Retrieves dataset by ID using dataset DAO.
   * @param id - The ID of the dataset to retrieve.
   * @returns Promise resolved with the found DatasetAttributes or null if not found.
   */
  async findById(id: number): Promise<DatasetAttributes | null> {
    return this.datasetDAO.findById(id); // Call DAO method to find dataset by ID
  }

  /**
   * Updates dataset by ID with partial updates using dataset DAO.
   * @param id - The ID of the dataset to update.
   * @param updates - The partial dataset attributes to update.
   * @returns Promise resolved with true if update is successful, false otherwise.
   */
  async update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean> {
    return this.datasetDAO.update(id, updates); // Call DAO method to update dataset
  }

  /**
   * Deletes dataset by ID using dataset DAO.
   * @param id - The ID of the dataset to delete.
   * @returns Promise resolved with true if deletion is successful, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    return this.datasetDAO.delete(id); // Call DAO method to delete dataset
  }

  /**
   * Finds datasets with the same name and user ID using dataset DAO.
   * @param name - The name of the dataset to search for.
   * @param userId - The ID of the user who owns the datasets.
   * @returns Promise resolved with an array of DatasetAttributes matching the criteria.
   */
  async datasetWithSameName(name: string, userId: number): Promise<DatasetAttributes[]> {
    return this.datasetDAO.datasetWithSameName(name, userId); // Call DAO method to find datasets with same name and user ID
  }

  /**
   * Retrieves all datasets for a specific user by their user ID.
   * @param userId - The ID of the user whose datasets are to be retrieved.
   * @returns A promise that resolves to an array of dataset attributes.
   */
  async getDatasetsByUserId(userId: number): Promise<DatasetAttributes[]> {
    return this.datasetDAO.getDatasetsByUserId(userId); // Call DAO method to find datasets
  }
}

// Export DatasetRepository class as default export
export default DatasetRepository;
