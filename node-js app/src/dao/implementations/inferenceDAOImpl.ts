import Inference, { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference';
import IInferenceDAO from '../interfaces/iInferenceDAO';

// Inference Data Access Object (DAO) class
class InferenceDAO implements IInferenceDAO {

  private static instance: InferenceDAO; // Singleton instance of InferenceDAO

  // Private constructor to enforce the Singleton pattern
  private constructor() { }

  // Static method to get the singleton instance of InferenceDAO
  static getInstance(): InferenceDAO {
    if (!InferenceDAO.instance) {
      InferenceDAO.instance = new InferenceDAO();
    }
    return InferenceDAO.instance;
  }

  // Method to create a new inference record
  async create(inference: InferenceCreationAttributes): Promise<InferenceAttributes> {
    const newInference = await Inference.create(inference); // Create the new inference
    return newInference.toJSON() as InferenceAttributes; // Return the created inference as JSON
  }

  // Method to find all inference records
  async findAll(): Promise<InferenceAttributes[]> {
    const inferences = await Inference.findAll(); // Find all inferences
    return inferences.map(inference => inference.toJSON() as InferenceAttributes); // Map and return the inferences as JSON
  }

  // Method to find an inference record by its ID
  async findById(id: number): Promise<InferenceAttributes | null> {
    const inference = await Inference.findByPk(id); // Find inference by primary key (ID)
    return inference ? inference.toJSON() as InferenceAttributes : null; // Return the inference as JSON or null if not found
  }

  // Method to update an inference record by its ID
  async update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean> {
    const [updatedRows] = await Inference.update(updates, { where: { id } }); // Update inference by ID
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }

  // Method to delete an inference record by its ID
  async delete(id: number): Promise<boolean> {
    const deletedRows = await Inference.destroy({ where: { id } }); // Delete inference by ID
    return deletedRows > 0; // Return true if rows were deleted, false otherwise
  }
}

export default InferenceDAO; // Export the InferenceDAO class
