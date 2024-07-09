import { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference';

/**
 * Interface defining methods for Data Access Object (DAO) operations related to Inference.
 * These methods outline CRUD (Create, Read, Update, Delete) operations for inference records.
 */
interface IInferenceDAO {
  /**
   * Creates a new inference record in the database.
   * @param inference - The attributes of the inference to create.
   * @returns A promise that resolves with the created inference attributes.
   */
  create(inference: InferenceCreationAttributes): Promise<InferenceAttributes>;

  /**
   * Retrieves all inference records from the database.
   * @returns A promise that resolves with an array of inference attributes.
   */
  findAll(): Promise<InferenceAttributes[]>;

  /**
   * Retrieves an inference record by its ID from the database.
   * @param id - The ID of the inference to find.
   * @returns A promise that resolves with the found inference attributes or null if not found.
   */
  findById(id: number): Promise<InferenceAttributes | null>;

  /**
   * Updates an inference record by its ID in the database with partial updates.
   * @param id - The ID of the inference to update.
   * @param updates - The partial inference attributes to update.
   * @returns A promise that resolves with true if the inference was updated successfully, false otherwise.
   */
  update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean>;

  /**
   * Deletes an inference record by its ID from the database.
   * @param id - The ID of the inference to delete.
   * @returns A promise that resolves with true if the inference was deleted successfully, false otherwise.
   */
  delete(id: number): Promise<boolean>;
}

export default IInferenceDAO; // Export the IInferenceDAO interface
