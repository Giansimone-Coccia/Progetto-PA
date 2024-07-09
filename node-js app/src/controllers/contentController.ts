import { Request, Response } from 'express';
import { ContentService } from '../services/contentService';
import { CustomRequest } from '../middleware/authMiddleware';
import { DatasetService } from '../services/datasetService';
import { UserService } from '../services/userService';

// Definition of the ContentController class for managing content
class ContentController {
  private static instance: ContentController;  // Singleton instance of the class
  private contentService: ContentService;      // Service for managing content
  private datasetService: DatasetService;      // Service for managing datasets
  private userService: UserService;            // Service for managing users

  // Private constructor to implement the Singleton pattern
  private constructor() {
    this.contentService = ContentService.getInstance();  // Get the singleton instance of ContentService
    this.datasetService = DatasetService.getInstance();  // Get the singleton instance of DatasetService
    this.userService = UserService.getInstance();        // Get the singleton instance of UserService
  }

  // Static method to get the singleton instance of ContentController
  public static getInstance(): ContentController {
    if (!this.instance) {
      this.instance = new ContentController();
    }
    return this.instance;
  }

  // Method to get all contents
  public getAllContents = async (req: Request, res: Response) => {
    const contents = await this.contentService.getAllContents();
    res.json(contents);
  };

  // Method to get content by ID
  public getContentById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
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

  // Method to create new content
  public createContent = async (req: CustomRequest, res: Response) => {
    const { datasetId, type } = req.body;
    let { name } = req.body;
    const userId = req.user?.id;

    // Check if required fields are present
    if (!datasetId || !type || !name) {
      return res.status(400).send('datasetId, type and name are required');
    }

    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const user = await this.userService.getUserById(userId);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const dataset = await this.datasetService.getDatasetById(datasetId);

      // Check if the dataset exists
      if (!dataset) {
        return res.status(404).json({ message: 'Dataset not found' });
      }

      // Check if the user owns the dataset
      if (dataset.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized access to dataset' });
      }

      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const data = req.file.buffer;
      const mimetype = req.file.mimetype;

      // Check if the file type is valid
      if (!ContentService.checkMimetype(type, mimetype)) {
        return res.status(400).json({ message: 'Invalid file type' });
      }

      // Calculate the cost of the content
      const cost = await this.contentService.calculateCost(type, data);

      // Check if the file type is valid
      if (cost === null) {
        return res.status(400).json({ message: 'Invalid file type' });
      }

      // Check if the user has enough tokens
      if (cost > user.tokens) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Deduct the cost from the user's tokens
      await this.userService.updateUser(userId, { tokens: user.tokens - cost });

      // Use the filename if provided
      if (req.file.filename) {
        name = req.file.filename;
      }

      const contentData = { ...req.body, cost, data, name };
      const content = await this.contentService.createContent(contentData);
      return res.status(201).json("Content created successfully");
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Method to update content
  public updateContent = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
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

  // Method to delete content
  public deleteContent = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID. ID must be a number' });
    }

    try {
      const success = await this.contentService.deleteContent(id);

      if (success) {
        res.status(204).end();  // Successfully deleted, no content to return
      } else {
        res.status(404).json({ message: 'Content not found' });
      }
    } catch (error) {
      console.error(`Error deleting content: ${error}`);
      res.status(500).json({ error: 'Failed to delete content' });
    }
  };
}

// Export the ContentController class
export default ContentController;
