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
  private contentService: ContentService;
  private datasetService: DatasetService;
  private userService: UserService;

  constructor() {
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

  getAllContents = async (req: Request, res: Response) => {
    const contents = await this.contentService.getAllContents();
    res.json(contents);
  };

  getContentById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const content = await this.contentService.getContentById(id);
    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  };

  createContent = async (req: CustomRequest, res: Response) => {
    const { datasetId, type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cost = ContentService.calculateCost(type);
        if (cost === null) {
            return res.status(400).json({ message: 'Invalid file type' });
        }

        if (typeof user.tokens !== 'number') {
            return res.status(500).json({ message: 'User tokens are not a number' });
        }

        if (cost > user.tokens) {
            return res.status(400).json({ message: 'Not enough tokens' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nessun file caricato' });
        }

        const data = req.file.buffer;
        const contentData = { ...req.body, cost, data };

        await this.userService.updateUser(userId, { tokens: user.tokens - cost });

        const dataset = await this.datasetService.getDatasetById(datasetId);
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }

        if (dataset.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access to dataset' });
        }

        const content = await this.contentService.createContent(contentData);
        return res.status(201).json(content);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateContent = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const content = await this.contentService.updateContent(id, req.body);
    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  };

  deleteContent = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const success = await this.contentService.deleteContent(id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  };

  /*async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Nessun file caricato' });
        return;
      }

      // Dati binari dell'immagine
      const imageData = req.file.buffer;

      // Creazione di un nuovo record nel database con Sequelize
      const newContent = await Content.create({
        datasetId: req.body.datasetId,
        type: 'image', 
        data: imageData, 
        cost: req.body.cost,
      });

      // Risposta di successo
      res.json({ message: 'Immagine caricata con successo!', content: newContent });
    } catch (error) {
      console.error('Errore durante il caricamento dell\'immagine:', error);
      res.status(500).json({ error: 'Errore durante il caricamento dell\'immagine. Controlla i log per i dettagli.' });
    }
  }*/
}

export default ContentController;
