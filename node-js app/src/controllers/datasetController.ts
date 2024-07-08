import { Request, Response } from 'express';
import { DatasetService } from '../services/datasetService';
import DatasetRepositoryImpl from '../repositories/implementations/datasetRepositoryImpl';
import DatasetDAO from '../dao/implementations/datasetDAOImpl';
import { CustomRequest } from '../middleware/authMiddleware';
import { ContentService } from '../services/contentService';
import ContentDAO from '../dao/implementations/contentDAOImpl';
import ContentRepositoryImpl from '../repositories/implementations/contentRepositoryImpl';

class DatasetController {
  private static instance: DatasetController;
  private datasetService: DatasetService;
  private contentService: ContentService;

  private constructor() {
    const datasetDAO = new DatasetDAO();
    const datasetRepository = new DatasetRepositoryImpl(datasetDAO);
    this.datasetService = new DatasetService(datasetRepository);

    const contentDAO = new ContentDAO();
    const contentRepository = new ContentRepositoryImpl(contentDAO);
    this.contentService = new ContentService(contentRepository);
  }

  public static getInstance(): DatasetController {
    if (!DatasetController.instance) {
      DatasetController.instance = new DatasetController();
    }
    return DatasetController.instance;
  }

  public getAllDatasets = async (req: Request, res: Response) => {
    const datasets = await this.datasetService.getAllDatasets();
    res.json(datasets);
  };

  public getDatasetById = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    // Controlla se l'id non è un numero o è NaN
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID. ID must be a number' });
    }

    try {
      const dataset = await this.datasetService.getDatasetById(id);

      if (!dataset) {
        return res.status(404).json({ message: 'Dataset not found' });
      }

      // Verifica se l'utente è autorizzato a accedere al dataset
      if (dataset.userId !== userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.json(dataset);
    } catch (error) {
      console.error(`Error retrieving dataset: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public createDataset = async (req: CustomRequest, res: Response) => {
    const userId = req.user?.id;
    const datasetData = { ...req.body, userId };

    try {
      const dataset = await this.datasetService.createDataset(datasetData);
      res.status(201).json(dataset);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateDataset = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const updatedAt = new Date()
    const datasetData = { ...req.body, userId , updatedAt};
    const { name } = datasetData
  
    // Trova il dataset esistente
    const existingDataset = await this.datasetService.getDatasetById(id);
    if (!existingDataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
  
    if (existingDataset.userId !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

      if ( name || userId) {
        
        const datasetsWithSameName = await this.datasetService.getDatasetWithSameName(name, userId);
    
        for (const dataset of datasetsWithSameName) {
          if (dataset.id === id) continue; 

          const existingContents = (await this.contentService.getContentByDatasetId(dataset.id)) || [];
          const currentContents = (await this.contentService.getContentByDatasetId(id)) || [];  
    
          /*const existingContents = (await this.contentService.getAllContents()).filter(content => content.datasetId === dataset.id);
          const currentContents = (await this.contentService.getAllContents()).filter(content => content.datasetId === id);*/
        
          const existingContentHashes = new Set(existingContents.map(content => this.datasetService.createContentHash(content)));
          const currentContentHashes = new Set(currentContents.map(content => this.datasetService.createContentHash(content)));
        
          const intersection = [...existingContentHashes].filter(hash => currentContentHashes.has(hash));
    
          if (intersection.length > 0) {
            return res.status(401).json({ message: 'Duplicate content detected in datasets with the same name for the user' });
          }
        }
      }
      
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

  public deleteDataset = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    try {

      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID. ID must be a number' });
      }
      
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
