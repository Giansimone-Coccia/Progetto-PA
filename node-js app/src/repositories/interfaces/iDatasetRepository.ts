import { DatasetAttributes, DatasetCreationAttributes } from '../../models/dataset';

// Interface defining methods for interacting with dataset entities
interface IDatasetRepository {
  /**
   * Method to create a new dataset entity.
   * @param dataset - The attributes of the dataset to create.
   * @returns Promise resolved with the created DatasetAttributes.
   */
  create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes>;

  /**
   * Method to retrieve all dataset entities.
   * @returns Promise resolved with an array of DatasetAttributes.
   */
  findAll(): Promise<DatasetAttributes[]>;

  /**
   * Method to find a dataset entity by its ID.
   * @param id - The ID of the dataset entity to retrieve.
   * @returns Promise resolved with the found DatasetAttributes or null if not found.
   */
  findById(id: number): Promise<DatasetAttributes | null>;

  /**
   * Method to update a dataset entity by its ID with partial updates.
   * @param id - The ID of the dataset entity to update.
   * @param updates - The partial dataset attributes to update.
   * @returns Promise resolved with true if update is successful, false otherwise.
   */
  update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean>;

  /**
   * Method to delete a dataset entity by its ID.
   * @param id - The ID of the dataset entity to delete.
   * @returns Promise resolved with true if deletion is successful, false otherwise.
   */
  delete(id: number): Promise<boolean>;

  /**
   * Method to find datasets with the same name and userId.
   * @param name - The name of the dataset to search for.
   * @param userId - The ID of the user who owns the datasets.
   * @returns Promise resolved with an array of DatasetAttributes that match the criteria.
   */
  datasetWithSameName(name: string, userId: number): Promise<DatasetAttributes[]>;
}

// Export the IDatasetRepository interface as the default export
export default IDatasetRepository;
