import { InferenceAttributes, InferenceCreationAttributes } from '../../models/inference';

// Interface defining methods for Data Access Object (DAO) operations related to Inference
interface IInferenceDAO {
  // Method to create a new inference record
  create(inference: InferenceCreationAttributes): Promise<InferenceAttributes>;

  // Method to find all inference records
  findAll(): Promise<InferenceAttributes[]>;

  // Method to find an inference record by its ID
  findById(id: number): Promise<InferenceAttributes | null>;

  // Method to update an inference record by its ID with partial updates
  update(id: number, updates: Partial<InferenceAttributes>): Promise<boolean>;

  // Method to delete an inference record by its ID
  delete(id: number): Promise<boolean>;
}

export default IInferenceDAO; // Export the IInferenceDAO interface
