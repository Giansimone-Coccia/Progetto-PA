import { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference';

// Interface defining methods for interacting with inference entities
interface IInferenceRepository {
  /**
   * Method to create a new inference entity.
   * @param inference - The attributes of the inference to create.
   * @returns Promise resolved with the created InferenceAttributes.
   */
  create(inference: InferenceCreationAttributes): Promise<InferenceAttributes>;

  /**
   * Method to retrieve all inference entities.
   * @returns Promise resolved with an array of InferenceAttributes.
   */
  findAll(): Promise<InferenceAttributes[]>;

  /**
   * Method to find an inference entity by its ID.
   * @param id - The ID of the inference entity to retrieve.
   * @returns Promise resolved with the found InferenceAttributes or null if not found.
   */
  findById(id: number): Promise<InferenceAttributes | null>;

  /**
   * Method to update an inference entity by its ID with partial updates.
   * @param id - The ID of the inference entity to update.
   * @param updates - The partial inference attributes to update.
   * @returns Promise resolved with true if update is successful, false otherwise.
   */
  update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean>;

  /**
   * Method to delete an inference entity by its ID.
   * @param id - The ID of the inference entity to delete.
   * @returns Promise resolved with true if deletion is successful, false otherwise.
   */
  delete(id: number): Promise<boolean>;
}

// Export the IInferenceRepository interface as the default export
export default IInferenceRepository;
