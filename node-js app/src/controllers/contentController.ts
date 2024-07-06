import { Request, Response } from 'express';
import { ContentService } from '../services/contentService';
import ContentRepositoryImpl from '../repositories/implementations/contentRepositoryImpl';
import ContentDAO from '../dao/implementations/contentDAOImpl';
import { CustomRequest } from '../middleware/authMiddleware';
import DatasetDAO from '../dao/implementations/datasetDAOImpl';
import DatasetRepositoryImpl from '../repositories/implementations/datasetRepositoryImpl';
import { DatasetService } from '../services/datasetService';
import { UserService } from '../services/userService';
import UserDAO from '../dao/implementations/userDAOImpl';
import UserRepositoryImpl from '../repositories/implementations/userRepositoryImpl';

class ContentController {
  private static instance: ContentController;
  private contentService: ContentService;
  private datasetService: DatasetService;
  private userService: UserService;

  private constructor() {
    const contentDAO = new ContentDAO();
    const contentRepository = new ContentRepositoryImpl(contentDAO);
    this.contentService = new ContentService(contentRepository);

    const datasetDAO = new DatasetDAO();
    const datasetRepository = new DatasetRepositoryImpl(datasetDAO);
    this.datasetService = new DatasetService(datasetRepository);

    const userDAO = new UserDAO();
    const userRepository = new UserRepositoryImpl(userDAO);
    this.userService = new UserService(userRepository);

  }

  public static getInstance(): ContentController {
    if (!ContentController.instance) {
      ContentController.instance = new ContentController();
    }
    return ContentController.instance;
  }

  public getAllContents = async (req: Request, res: Response) => {
    const contents = await this.contentService.getAllContents();
    res.json(contents);
  };

  public getContentById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Controlla se l'id non è un numero o è NaN
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID. ID must be a number' });
    }

    try {
      const content = await this.contentService.getContentById(id);

      if (content) {
        res.json(content);
      } else {
        res.status(404).json({ message: 'Content not found' });
      }
    } catch (error) {
      console.error(`Error retrieving content: ${error}`);
      res.status(500).json({ error: 'Failed to retrieve content' });
    }
  };

  public createContent = async (req: CustomRequest, res: Response) => {
    const { datasetId, type } = req.body;
    let { name } = req.body;
    const userId = req.user?.id;
  
    if (!datasetId || !type || !name) {
      return res.status(400).send('datasetId, type and name are required');
    }
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }
  
      const data = req.file.buffer;
      const mimetype = req.file.mimetype;
  
      if (!ContentService.checkMimetype(type, mimetype)) {
        return res.status(400).json({ message: 'Invalid file type' });
      }
  
      const cost = ContentService.calculateCost(type, data);
  
      if (cost === null) {
        return res.status(400).json({ message: 'Invalid file type' });
      }
  
      if (typeof user.tokens !== 'number') {
        return res.status(500).json({ message: 'User tokens are not a number' });
      }
  
      if (cost > user.tokens) {
        return res.status(400).json({ message: 'Not enough tokens' });
      }
  
      await this.userService.updateUser(userId, { tokens: user.tokens - cost });
  
      const dataset = await this.datasetService.getDatasetById(datasetId);
      if (!dataset) {
        return res.status(404).json({ message: 'Dataset not found' });
      }
  
      if (dataset.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized access to dataset' });
      }
  
      if (req.file.filename) {
        name = req.file.filename;
      }
  
      const contentData = { ...req.body, cost, data, name };
      const content = await this.contentService.createContent(contentData);
      return res.status(201).json("Contenuto creato con successo");
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };  

  public updateContent = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Controlla se l'id non è un numero o è NaN
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID. ID must be a number' });
    }

    try {
      const content = await this.contentService.updateContent(id, req.body);

      if (content) {
        res.json(content);
      } else {
        res.status(404).json({ message: 'Content not found' });
      }
    } catch (error) {
      console.error(`Error updating content: ${error}`);
      res.status(500).json({ error: 'Failed to update content' });
    }
  };

  public deleteContent = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Controlla se l'id non è un numero o è NaN
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID. ID must be a number' });
    }

    try {
      const success = await this.contentService.deleteContent(id);

      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Content not found' });
      }
    } catch (error) {
      console.error(`Error deleting content: ${error}`);
      res.status(500).json({ error: 'Failed to delete content' });
    }
  };
}

export default ContentController;
