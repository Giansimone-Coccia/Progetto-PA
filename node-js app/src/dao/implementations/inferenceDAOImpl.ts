import Inference, { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference';
import IInferenceDAO from '../interfaces/iInferenceDAO';

/**
 * Data Access Object (DAO) class for interacting with inference records.
 * Implements methods to create, read, update, and delete inferences.
 */
class InferenceDAO implements IInferenceDAO {

  private static instance: InferenceDAO; // Singleton instance of InferenceDAO

  /**
   * Private constructor to enforce the Singleton pattern.
   * Use InferenceDAO.getInstance() to obtain the singleton instance.
   */
  private constructor() { }

  /**
   * Static method to get the singleton instance of InferenceDAO.
   * @returns The singleton instance of InferenceDAO.
   */
  static getInstance(): InferenceDAO {
    if (!InferenceDAO.instance) {
      InferenceDAO.instance = new InferenceDAO();
    }
    return InferenceDAO.instance;
  }

  /**
   * Creates a new inference record in the database.
   * @param inference - The attributes of the inference to create.
   * @returns A promise that resolves with the created inference attributes.
   */
  async create(inference: InferenceCreationAttributes): Promise<InferenceAttributes> {
    const newInference = await Inference.create(inference); // Create the new inference
    return newInference.toJSON() as InferenceAttributes; // Return the created inference as JSON
  }

  /**
   * Finds all inference records in the database.
   * @returns A promise that resolves with an array of inference attributes.
   */
  async findAll(): Promise<InferenceAttributes[]> {
    const inferences = await Inference.findAll(); // Find all inferences
    return inferences.map(inference => inference.toJSON() as InferenceAttributes); // Map and return the inferences as JSON
  }

  /**
   * Finds an inference record by its ID in the database.
   * @param id - The ID of the inference to find.
   * @returns A promise that resolves with the found inference attributes or null if not found.
   */
  async findById(id: number): Promise<InferenceAttributes | null> {
    const inference = await Inference.findByPk(id); // Find inference by primary key (ID)
    return inference ? inference.toJSON() as InferenceAttributes : null; // Return the inference as JSON or null if not found
  }

  /**
   * Updates an inference record by its ID in the database.
   * @param id - The ID of the inference to update.
   * @param updates - The partial inference attributes to update.
   * @returns A promise that resolves with true if the inference was updated successfully, false otherwise.
   */
  async update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean> {
    const [updatedRows] = await Inference.update(updates, { where: { id } }); // Update inference by ID
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }

  /**
   * Deletes an inference record by its ID from the database.
   * @param id - The ID of the inference to delete.
   * @returns A promise that resolves with true if the inference was deleted successfully, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    const deletedRows = await Inference.destroy({ where: { id } }); // Delete inference by ID
    return deletedRows > 0; // Return true if rows were deleted, false otherwise
  }
}

export default InferenceDAO; // Export the InferenceDAO class
