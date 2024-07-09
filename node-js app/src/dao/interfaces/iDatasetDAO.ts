import { DatasetAttributes, DatasetCreationAttributes } from '../../models/dataset';

/**
 * Interface defining methods for Data Access Object (DAO) operations related to Dataset.
 * These methods outline CRUD (Create, Read, Update, Delete) operations and additional methods for querying datasets.
 */
interface IDatasetDAO {
  /**
   * Creates a new dataset record in the database.
   * @param dataset - The attributes of the dataset to create.
   * @returns A promise that resolves with the created dataset attributes.
   */
  create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes>;

  /**
   * Retrieves all dataset records from the database.
   * @returns A promise that resolves with an array of dataset attributes.
   */
  findAll(): Promise<DatasetAttributes[]>;

  /**
   * Retrieves a dataset record by its ID from the database.
   * @param id - The ID of the dataset to find.
   * @returns A promise that resolves with the found dataset attributes or null if not found.
   */
  findById(id: number): Promise<DatasetAttributes | null>;

  /**
   * Updates a dataset record by its ID in the database with partial updates.
   * @param id - The ID of the dataset to update.
   * @param updates - The partial dataset attributes to update.
   * @returns A promise that resolves with true if the dataset was updated successfully, false otherwise.
   */
  update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean>;

  /**
   * Deletes a dataset record by its ID from the database.
   * @param id - The ID of the dataset to delete.
   * @returns A promise that resolves with true if the dataset was deleted successfully, false otherwise.
   */
  delete(id: number): Promise<boolean>;

  /**
   * Retrieves datasets with the same name for a specific user from the database.
   * @param name - The name of the dataset to find.
   * @param userId - The ID of the user who owns the datasets.
   * @returns A promise that resolves with an array of dataset attributes matching the name and user ID.
   */
  datasetWithSameName(name: string, userId: number): Promise<DatasetAttributes[]>;
}

export default IDatasetDAO; // Export the IDatasetDAO interface
