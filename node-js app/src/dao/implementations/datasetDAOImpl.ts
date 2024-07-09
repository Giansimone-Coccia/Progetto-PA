import Dataset, { DatasetAttributes, DatasetCreationAttributes } from '../../models/dataset';
import IDatasetDAO from '../interfaces/iDatasetDAO';

/**
 * Data Access Object (DAO) class for interacting with dataset records.
 * Implements methods to create, read, update, soft-delete, and find datasets.
 */
class DatasetDAO implements IDatasetDAO {
  
  private static instance: DatasetDAO; // Singleton instance of DatasetDAO

  /**
   * Private constructor to enforce the Singleton pattern.
   * Use DatasetDAO.getInstance() to obtain the singleton instance.
   */
  private constructor() {
  }

  /**
   * Static method to get the singleton instance of DatasetDAO.
   * @returns The singleton instance of DatasetDAO.
   */
  public static getInstance(): DatasetDAO {
    if (!DatasetDAO.instance) {
      DatasetDAO.instance = new DatasetDAO();
    }
    return DatasetDAO.instance;
  }

  /**
   * Creates a new dataset record in the database.
   * @param dataset - The attributes of the dataset to create.
   * @returns A promise that resolves with the created dataset attributes.
   */
  async create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    const newDataset = await Dataset.create(dataset); // Create the new dataset
    return newDataset.toJSON() as DatasetAttributes; // Return the created dataset as JSON
  }

  /**
   * Finds all dataset records in the database.
   * @returns A promise that resolves with an array of dataset attributes.
   */
  async findAll(): Promise<DatasetAttributes[]> {
    const datasets = await Dataset.findAll(); // Find all datasets
    return datasets.map(dataset => dataset.toJSON() as DatasetAttributes); // Map and return the datasets as JSON
  }

  /**
   * Finds a dataset record by its ID in the database.
   * @param id - The ID of the dataset to find.
   * @returns A promise that resolves with the found dataset attributes or null if not found.
   */
  async findById(id: number): Promise<DatasetAttributes | null> {
    const dataset = await Dataset.findByPk(id); // Find dataset by primary key (ID)
    return dataset ? dataset.toJSON() as DatasetAttributes : null; // Return the dataset as JSON or null if not found
  }

  /**
   * Updates a dataset record by its ID in the database.
   * @param id - The ID of the dataset to update.
   * @param updates - The partial dataset attributes to update.
   * @returns A promise that resolves with true if the dataset was updated successfully, false otherwise.
   */
  async update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean> {
    const [updatedRows] = await Dataset.update(updates, { where: { id } }); // Update dataset by ID
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }

  /**
   * Finds datasets with the same name for a specific user in the database.
   * @param name - The name of the dataset to search for.
   * @param userId - The ID of the user who owns the datasets.
   * @returns A promise that resolves with an array of dataset attributes matching the name and user ID.
   */
  async datasetWithSameName(name: string, userId: number): Promise<DatasetAttributes[]> {
    const datasetsWithSameName = await Dataset.findAll({ where: { name: name, userId: userId } }); // Find datasets with the same name and user ID
    return datasetsWithSameName.map(dataset => dataset.toJSON() as DatasetAttributes); // Map and return the datasets as JSON
  }

  /**
   * Soft-deletes a dataset record by marking it as deleted in the database.
   * @param id - The ID of the dataset to delete.
   * @returns A promise that resolves with true if the dataset was soft-deleted successfully, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    const [updatedRows] = await Dataset.update(
      { isDeleted: true }, // Mark the dataset as deleted
      { where: { id } } // Find the dataset by ID
    );
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }
}

export default DatasetDAO; // Export the DatasetDAO class
