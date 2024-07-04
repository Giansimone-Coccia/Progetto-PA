import Dataset, { DatasetAttributes, DatasetCreationAttributes } from '../../models/Dataset';
import IDatasetDAO from '../Interfaces/IDatasetDAO';

class DatasetDAO implements IDatasetDAO {
  async create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    const newDataset = await Dataset.create(dataset);
    return newDataset.toJSON() as DatasetAttributes;
  }

  async findAll(): Promise<DatasetAttributes[]> {
    const contents = await Dataset.findAll();
    return contents.map(dataset => dataset.toJSON() as DatasetAttributes);
  } 

  async findById(id: number): Promise<DatasetAttributes | null> {
    const dataset = await Dataset.findByPk(id);
    return dataset ? dataset.toJSON() as DatasetAttributes : null;
  }

  async update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean> {
    const [updatedRows] = await Dataset.update(updates, { where: { id } });
    return updatedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await Dataset.destroy({ where: { id } });
    return deletedRows > 0;
  }
}

export default DatasetDAO;
