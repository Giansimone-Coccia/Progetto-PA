import Dataset, { DatasetAttributes, DatasetCreationAttributes } from '../../models/dataset';
import IDatasetDAO from '../interfaces/iDatasetDAO';

// Dataset Data Access Object (DAO) class
class DatasetDAO implements IDatasetDAO {

  private static instance: DatasetDAO; // Singleton instance of DatasetDAO

  // Private constructor to enforce the Singleton pattern
  private constructor() {
  }

  // Static method to get the singleton instance of DatasetDAO
  public static getInstance(): DatasetDAO {
    if (!DatasetDAO.instance) {
      DatasetDAO.instance = new DatasetDAO();
    }
    return DatasetDAO.instance;
  }

  // Method to create a new dataset record
  async create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    const newDataset = await Dataset.create(dataset); // Create the new dataset
    return newDataset.toJSON() as DatasetAttributes; // Return the created dataset as JSON
  }

  // Method to find all dataset records
  async findAll(): Promise<DatasetAttributes[]> {
    const datasets = await Dataset.findAll(); // Find all datasets
    return datasets.map(dataset => dataset.toJSON() as DatasetAttributes); // Map and return the datasets as JSON
  }

  // Method to find a dataset record by its ID
  async findById(id: number): Promise<DatasetAttributes | null> {
    const dataset = await Dataset.findByPk(id); // Find dataset by primary key (ID)
    return dataset ? dataset.toJSON() as DatasetAttributes : null; // Return the dataset as JSON or null if not found
  }

  // Method to update a dataset record by its ID
  async update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean> {
    const [updatedRows] = await Dataset.update(updates, { where: { id } }); // Update dataset by ID
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }

  // Method to find datasets with the same name for a specific user
  async datasetWithSameName(name: string, userId: number): Promise<DatasetAttributes[]> {
    const datasetsWithSameName = await Dataset.findAll({ where: { name: name, userId: userId } }); // Find datasets with the same name and user ID
    return datasetsWithSameName.map(dataset => dataset.toJSON() as DatasetAttributes); // Map and return the datasets as JSON
  }

  // Method to soft-delete a dataset record by its ID
  async delete(id: number): Promise<boolean> {
    const [updatedRows] = await Dataset.update(
      { isDeleted: true }, // Mark the dataset as deleted
      { where: { id } } // Find the dataset by ID
    );
    return updatedRows > 0; // Return true if rows were updated, false otherwise
  }
}

export default DatasetDAO; // Export the DatasetDAO class
