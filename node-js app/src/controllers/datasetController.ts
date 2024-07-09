import { Request, Response } from 'express';
import { DatasetService } from '../services/datasetService';
import { CustomRequest } from '../middleware/authMiddleware';
import { ContentService } from '../services/contentService';

/**
 * Controller class for managing dataset operations.
 * Provides methods for CRUD operations on datasets.
 */
class DatasetController {
  private static instance: DatasetController;  // Singleton instance of the class
  private datasetService: DatasetService;      // Service for managing datasets
  private contentService: ContentService;      // Service for managing content

  /**
   * Private constructor to implement the Singleton pattern.
   * Initializes DatasetService and ContentService instances.
   */
  private constructor() {
    this.datasetService = DatasetService.getInstance();  // Get the singleton instance of DatasetService
    this.contentService = ContentService.getInstance();  // Get the singleton instance of ContentService
  }

  /**
   * Static method to get the singleton instance of DatasetController.
   * @returns The singleton instance of DatasetController.
   */
  public static getInstance(): DatasetController {
    if (!this.instance) {
      this.instance = new DatasetController();
    }
    return this.instance;
  }

  /**
   * Controller method to get all datasets.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with all datasets retrieved from the database.
   */
  public getAllDatasets = async (req: Request, res: Response) => {
    const datasets = await this.datasetService.getAllDatasets();
    res.json(datasets);
  };

  /**
   * Controller method to get a dataset by ID.
   * @param req - The Express request object containing the dataset ID.
   * @param res - The Express response object.
   * @returns A JSON response with the dataset retrieved by its ID or an error message if not found or unauthorized.
   */
  public getDatasetById = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    // Check if the ID is valid
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID. ID must be a number' });
    }

    try {
      const dataset = await this.datasetService.getDatasetById(id);

      if (!dataset) {
        return res.status(404).json({ message: 'Dataset not found' });
      }

      // Verify if the user is authorized to access the dataset
      if (dataset.userId !== userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.json(dataset);
    } catch (error) {
      console.error(`Error retrieving dataset: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Controller method to create a new dataset.
   * @param req - The Express request object containing dataset data.
   * @param res - The Express response object.
   * @returns A JSON response with the newly created dataset or an error message if creation fails.
   */
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

  /**
   * Controller method to update a dataset.
   * @param req - The Express request object containing dataset data.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of dataset update.
   */
  public updateDataset = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const updatedAt = new Date();
    const datasetData = { ...req.body, userId, updatedAt };
    const { name } = datasetData;

    // Find the existing dataset
    const existingDataset = await this.datasetService.getDatasetById(id);
    if (!existingDataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Check if user is authorized to update the dataset
    if (existingDataset.userId !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Check for duplicate content if name or userId has been changed
      if (name || userId) {
        const datasetsWithSameName = await this.datasetService.getDatasetWithSameName(name, userId);

        for (const dataset of datasetsWithSameName) {
          if (dataset.id === id) continue;

          const existingContents = (await this.contentService.getContentByDatasetId(dataset.id)) || [];
          const currentContents = (await this.contentService.getContentByDatasetId(id)) || [];

          const existingContentHashes = new Set(existingContents.map(content => this.datasetService.createContentHash(content)));
          const currentContentHashes = new Set(currentContents.map(content => this.datasetService.createContentHash(content)));

          const intersection = [...existingContentHashes].filter(hash => currentContentHashes.has(hash));

          if (intersection.length > 0) {
            return res.status(401).json({ message: 'Duplicate content detected in datasets with the same name for the user' });
          }
        }
      }

      const datasetUpdated = await this.datasetService.updateDataset(id, req.body);

      if (datasetUpdated) {
        res.json("Dataset updated");
      } else {
        res.status(400).json({ message: 'Failed to update dataset' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Controller method to delete a dataset.
   * @param req - The Express request object containing dataset ID.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of dataset deletion.
   */
  public deleteDataset = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    try {
      // Check if the ID is valid
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
        res.status(204).end();  // Successfully deleted, no content to return
      } else {
        res.status(404).json({ message: 'Dataset not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

// Export the DatasetController class
export default DatasetController;
