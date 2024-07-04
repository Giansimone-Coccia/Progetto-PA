import { DatasetAttributes, DatasetCreationAttributes } from '../../models/Dataset';

interface IDatasetDAO {
  create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes>;
  findById(id: number): Promise<DatasetAttributes | null>;
  update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

export default IDatasetDAO;
