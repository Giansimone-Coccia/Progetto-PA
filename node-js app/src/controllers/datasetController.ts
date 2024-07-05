import { Request, Response } from 'express';
import { DatasetService } from '../services/datasetService';
import DatasetRepositoryImpl from '../repositories/implementations/datasetRepositoryImpl';
import DatasetDAO from '../dao/implementations/datasetDAOImpl';
import { CustomRequest } from '../middleware/authMiddleware';
import { ContentService } from '../services/contentService';
import ContentDAO from '../dao/implementations/contentDAOImpl';
import ContentRepositoryImpl from '../repositories/implementations/contentRepositoryImpl';

class DatasetController {
  private datasetService: DatasetService;
  private contentService: ContentService;

  constructor() {
    const datasetDAO = new DatasetDAO();
    const datasetRepository = new DatasetRepositoryImpl(datasetDAO);
    this.datasetService = new DatasetService(datasetRepository);

    const contentDAO = new ContentDAO();
    const contentRepository = new ContentRepositoryImpl(contentDAO);
    this.contentService = new ContentService(contentRepository);
  }

  getAllDatasets = async (req: Request, res: Response) => {
    const datasets = await this.datasetService.getAllDatasets();
    res.json(datasets);
  };

  getDatasetById = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    try {
      const dataset = await this.datasetService.getDatasetById(id);

      if (!dataset) {
        return res.status(404).json({ message: 'Dataset not found' });
      } else if (dataset.userId !== userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.json(dataset);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createDataset = async (req: CustomRequest, res: Response) => {
    const userId = req.user?.id;
    const datasetData = { ...req.body, userId };

    try {
      const dataset = await this.datasetService.createDataset(datasetData);
      res.status(201).json(dataset);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateDataset = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const datasetData = { ...req.body, userId };
    const { name } = datasetData
  
    // Trova il dataset esistente
    const existingDataset = await this.datasetService.getDatasetById(id);
    if (!existingDataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
  
    if (existingDataset.userId !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    if ( name || userId) {
      
      const datasetsWithSameName = await this.datasetService.getDatasetWithSameName(name, userId);
  
      for (const dataset of datasetsWithSameName) {
        if (dataset.id === id) continue; // Skip the current dataset
  
        const existingContents = (await this.contentService.getAllContents()).filter(content => content.datasetId === dataset.id);
        const currentContents = (await this.contentService.getAllContents()).filter(content => content.datasetId === id);
      
        const existingContentHashes = new Set(existingContents.map(content => DatasetService.createContentHash(content)));
        const currentContentHashes = new Set(currentContents.map(content => DatasetService.createContentHash(content)));
      
        const intersection = [...existingContentHashes].filter(hash => currentContentHashes.has(hash));
  
        if (intersection.length > 0) {
          return res.status(401).json({ message: 'Duplicate content detected in datasets with the same name for the user' });
        }
      }
    }
  
    try {
      
      let datasetUpdated = await this.datasetService.updateDataset(id, req.body);
  
      if (datasetUpdated) {
        res.json("Dataset updated");
      } else {
        res.status(400).json({ message: 'Failed to update dataset' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    };
  };

  deleteDataset = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    try {
      const dataset = await this.datasetService.getDatasetById(id);

      if (!dataset) {
        return res.status(404).json({ message: 'Dataset not found' });
      } else if (dataset.userId !== userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const success = await this.datasetService.deleteDataset(id);

      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Dataset not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default DatasetController;
