import Content from '../../models/Content';
import Dataset, { DatasetAttributes, DatasetCreationAttributes } from '../../models/Dataset';
import IDatasetDAO from '../Interfaces/IDatasetDAO';

class DatasetDAO implements IDatasetDAO {
  async create(dataset: DatasetCreationAttributes): Promise<DatasetAttributes> {
    const newDataset = await Dataset.create(dataset);
    return newDataset.toJSON() as DatasetAttributes;
  }

  async findAll(): Promise<DatasetAttributes[]> {
    const datasets = await Dataset.findAll();
    return datasets.map(dataset => dataset.toJSON() as DatasetAttributes);
  } 

  async findById(id: number): Promise<DatasetAttributes | null> {
    const dataset = await Dataset.findByPk(id);
    return dataset ? dataset.toJSON() as DatasetAttributes : null;
  }

  async update(id: number, updates: Partial<DatasetAttributes>): Promise<boolean> {

    const createContentHash = (content: Content) => {
      return `${content.type}-${content.path}-${content.cost}`;
    };

    // Trova il dataset esistente
    const existingDataset = await Dataset.findByPk(id);
    if (!existingDataset) {
      throw new Error('Dataset not found');
    }

    // Verifica che i contenuti del dataset non esistano già in un altro dataset con lo stesso nome e utente
    const { name, userId } = updates;

    if (name || userId) {
      const datasetsWithSameName = await Dataset.findAll({ where: { name: name || existingDataset.name, userId: userId || existingDataset.userId } });

      for (const dataset of datasetsWithSameName) {
        if (dataset.id === id) continue; // Skip the current dataset

        const existingContents = await Content.findAll({ where: { datasetId: dataset.id } });
        const currentContents = await Content.findAll({ where: { datasetId: id } });
      
        const existingContentHashes = new Set(existingContents.map(content => createContentHash(content)));
        const currentContentHashes = new Set(currentContents.map(content => createContentHash(content)));
      
        const intersection = [...existingContentHashes].filter(hash => currentContentHashes.has(hash));

        if (intersection.length > 0) {
          throw new Error('Duplicate content detected in datasets with the same name for the user');
        }
      }
    }

    const [updatedRows] = await Dataset.update(updates, { where: { id } });
    return updatedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [updatedRows] = await Dataset.update(
      { isDeleted: true },
      { where: { id } }
    );
    return updatedRows > 0;
  }  
}

export default DatasetDAO;
