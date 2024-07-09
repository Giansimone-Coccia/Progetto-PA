import InferenceDAO from '../../dao/implementations/inferenceDAOImpl'; // Import the concrete implementation of inference DAO
import IInferenceDAO from '../../dao/interfaces/iInferenceDAO'; // Import the interface for inference DAO
import { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference'; // Import inference attributes and creation attributes
import IInferenceRepository from '../interfaces/iInferenceRepository'; // Import interface for inference repository

// Repository class implementing IInferenceRepository interface
class InferenceRepository implements IInferenceRepository {
  private static instance: InferenceRepository; // Static instance of InferenceRepository
  private inferenceDAO: IInferenceDAO; // Instance of inference DAO interface

  // Private constructor to initialize inference DAO instance
  private constructor() {
    this.inferenceDAO = InferenceDAO.getInstance(); // Get singleton instance of InferenceDAO
  }

  /**
   * Singleton pattern: Get instance of InferenceRepository.
   * @returns The singleton instance of InferenceRepository.
   */
  static getInstance(){
    if (!this.instance) {
      this.instance = new InferenceRepository(); // Create new instance if not exists
    }
    return this.instance; // Return existing instance
  }

  /**
   * Creates an inference using inference DAO.
   * @param inference - The inference creation attributes.
   * @returns Promise resolved with the created inference attributes.
   */
  async create(inference: InferenceCreationAttributes): Promise<InferenceAttributes> {
    return this.inferenceDAO.create(inference); // Call DAO method to create inference
  }

  /**
   * Retrieves all inferences using inference DAO.
   * @returns Promise resolved with an array of InferenceAttributes.
   */
  async findAll(): Promise<InferenceAttributes[]> {
    return this.inferenceDAO.findAll(); // Call DAO method to find all inferences
  }

  /**
   * Retrieves inference by ID using inference DAO.
   * @param id - The ID of the inference to retrieve.
   * @returns Promise resolved with the found InferenceAttributes or null if not found.
   */
  async findById(id: number): Promise<InferenceAttributes | null> {
    return this.inferenceDAO.findById(id); // Call DAO method to find inference by ID
  }

  /**
   * Updates inference by ID with partial updates using inference DAO.
   * @param id - The ID of the inference to update.
   * @param updates - The partial inference attributes to update.
   * @returns Promise resolved with true if update is successful, false otherwise.
   */
  async update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean> {
    return this.inferenceDAO.update(id, updates); // Call DAO method to update inference
  }

  /**
   * Deletes inference by ID using inference DAO.
   * @param id - The ID of the inference to delete.
   * @returns Promise resolved with true if deletion is successful, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    return this.inferenceDAO.delete(id); // Call DAO method to delete inference
  }
}

// Export InferenceRepository class as default export
export default InferenceRepository;
