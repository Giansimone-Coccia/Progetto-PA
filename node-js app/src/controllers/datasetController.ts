import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DatasetService } from '../services/datasetService';
import { CustomRequest } from '../middleware/authMiddleware';
import { ContentService } from '../services/contentService';
import ErrorFactory from '../error/errorFactory';
import { checkDatasetOverlap } from '../utils/checkDatasetOverlap';

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
   * Controller method to get all datasets by user ID.
   * @param req - The Express request object containing user information.
   * @param res - The Express response object.
   * @param next - The Express next function for error handling.
   * @returns A JSON response with all datasets retrieved from the database.
   */
  public getAllDatasetsByUserId = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (userId === undefined) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid ID. ID must be a number'));
      }

      const datasets = await this.datasetService.getDatasetByUserId(userId);
      res.json(datasets);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller method to retrieve all datasets.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @param next - The Express next function for error handling.
   * @returns A JSON response with all datasets retrieved from the database.
   */
  public getAllDatasets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const datasets = await this.datasetService.getAllDatasets();

      if (!datasets) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Dataset not found'));
      }

      res.json(datasets);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller method to get a dataset by ID.
   * @param req - The Express request object containing the dataset ID.
   * @param res - The Express response object.
   * @returns A JSON response with the dataset retrieved by its ID or an error message if not found or unauthorized.
   */
  public getDatasetById = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    // Check if the ID is valid
    if (isNaN(id)) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid ID. ID must be a number'));
    }

    try {
      const dataset = await this.datasetService.getDatasetById(id);

      if (!dataset) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Dataset not found'));
      }

      if (dataset.userId !== userId) {
        return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
      }

      res.json(dataset);
    } catch (error) {
      next(error);
    }
  };

  /**
     * Controller method to create a new dataset.
     * @param req - The Express request object containing dataset data.
     * @param res - The Express response object.
     * @returns A JSON response with the newly created dataset or an error message if creation fails.
     */
  public createDataset = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { name, tags } = req.body;

    if (!userId) {
      return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
    }

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "The 'name' field is required." });
    }

    if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "The 'tags' field must be an array of strings." });
    }

    const datasetData = { ...req.body, userId };

     let yolo =await checkDatasetOverlap( name, userId, this.datasetService, this.contentService)

     console.log(yolo)

    if (yolo) {
      return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Duplicate content detected in datasets with the same name for the user'));
    }

    try {
      const dataset = await this.datasetService.createDataset(datasetData);
      res.status(StatusCodes.CREATED).json(dataset);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller method to update a dataset.
   * @param req - The Express request object containing dataset data.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of dataset update.
   */
  public updateDataset = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const updatedAt = new Date();
    const datasetData = { ...req.body, userId, updatedAt };
    const { name } = datasetData;

    // Find the existing dataset
    const existingDataset = await this.datasetService.getDatasetById(id);
    if (!existingDataset) {
      return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Dataset not found'));
    }

    if (existingDataset.userId !== userId) {
      return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
    }

    try {
      // Check for duplicate content if name or userId has been changed
      /*if (name || userId) {
        const datasetsWithSameName = await this.datasetService.getDatasetWithSameName(name, userId);

        for (const dataset of datasetsWithSameName) {
          if (dataset.id === id) continue;

          const existingContents = (await this.contentService.getContentByDatasetId(dataset.id)) || [];
          const currentContents = (await this.contentService.getContentByDatasetId(id)) || [];

          const existingContentHashes = new Set(existingContents.map(content => this.datasetService.createContentHash(content)));
          const currentContentHashes = new Set(currentContents.map(content => this.datasetService.createContentHash(content)));

          const intersection = [...existingContentHashes].filter(hash => currentContentHashes.has(hash));

          if (intersection.length > 0) {
            return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Duplicate content detected in datasets with the same name for the user'));
          }
        }
      }*/

      if (await checkDatasetOverlap( name, userId, this.datasetService, this.contentService, id)) {
        return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Duplicate content detected in datasets with the same name for the user'));
      }

      const datasetUpdated = await this.datasetService.updateDataset(id, datasetData);

      if (datasetUpdated) {
        res.status(StatusCodes.OK).json({ message: "Dataset updated" });
      } else {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Failed to update dataset'));
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller method to delete a dataset.
   * @param req - The Express request object containing dataset ID.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of dataset deletion.
   */
  public deleteDataset = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    try {
      // Check if the ID is valid
      if (isNaN(id)) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid ID. ID must be a number'));
      }

      const dataset = await this.datasetService.getDatasetById(id);

      if (!dataset) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Dataset not found'));
      }

      if (dataset.userId !== userId) {
        return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
      }

      if (dataset.isDeleted === true) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Dataset already deleted'));
      }

      const success = await this.datasetService.deleteDataset(id);

      if (success) {
        res.status(StatusCodes.OK).send({ message: "Dataset eliminated correctly" });
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Dataset not found'));
      }
    } catch (error) {
      next(error);
    }
  };
}

// Export the DatasetController class
export default DatasetController;
