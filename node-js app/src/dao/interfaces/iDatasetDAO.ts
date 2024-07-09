import { DatasetAttributes, DatasetCreationAttributes } from '../../models/dataset';

// Interface defining methods for Data Access Object (DAO) operations related to Dataset
interface IDatasetDAO {
  // Method to create a new dataset record
  create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes>;

  // Method to find all dataset records
  findAll(): Promise<DatasetAttributes[]>;

  // Method to find a dataset record by its ID
  findById(id: number): Promise<DatasetAttributes | null>;

  // Method to update a dataset record by its ID with partial updates
  update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean>;

  // Method to delete a dataset record by its ID
  delete(id: number): Promise<boolean>;

  // Method to find datasets with the same name for a specific user
  datasetWithSameName(name: string, userId: number): Promise<DatasetAttributes[]>;
}

export default IDatasetDAO; // Export the IDatasetDAO interface
