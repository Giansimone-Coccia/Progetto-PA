import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services/contentService';
import { CustomRequest } from '../middleware/authMiddleware';
import { DatasetService } from '../services/datasetService';
import { UserService } from '../services/userService';
import ErrorFactory from '../error/errorFactory';
import { StatusCodes } from 'http-status-codes';

/**
 * Controller class for managing content operations.
 * Provides methods for CRUD operations on content.
 */
class ContentController {
  private static instance: ContentController;  // Singleton instance of the class
  private contentService: ContentService;      // Service for managing content
  private datasetService: DatasetService;      // Service for managing datasets
  private userService: UserService;            // Service for managing users

  /**
   * Private constructor to implement the Singleton pattern.
   * Initializes ContentService, DatasetService, and UserService instances.
   */
  private constructor() {
    this.contentService = ContentService.getInstance();  // Get the singleton instance of ContentService
    this.datasetService = DatasetService.getInstance();  // Get the singleton instance of DatasetService
    this.userService = UserService.getInstance();        // Get the singleton instance of UserService
  }

  /**
   * Static method to get the singleton instance of ContentController.
   * @returns The singleton instance of ContentController.
   */
  public static getInstance(): ContentController {
    if (!this.instance) {
      this.instance = new ContentController();
    }
    return this.instance;
  }

  /**
   * Controller method to get all contents.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with all contents retrieved from the database.
   */
  public getAllContents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contents = await this.contentService.getAllContents();
      res.json(contents);
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve contents'));
    }
  };

  /**
   * Controller method to get content by ID.
   * @param req - The Express request object containing the content ID.
   * @param res - The Express response object.
   * @returns A JSON response with the content retrieved by its ID or an error message if not found.
   */
  public getContentById = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
    if (isNaN(id)) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid ID. ID must be a number'));
    }

    try {
      const content = await this.contentService.getContentById(id);

      if (content) {
        res.json(content);
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Content not found'));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve content'));
    }
  };

  /**
   * Controller method to create new content.
   * @param req - The Express request object containing content data.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of content creation.
   */
  public createContent = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { datasetId, type } = req.body;
    let { name } = req.body;
    const userId = req.user?.id;

    // Check if required fields are present
    if (!datasetId || !type || !name) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'datasetId, type and name are required'));
    }

    // Check if the user is authenticated
    if (!userId) {
      return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
    }

    try {
      const user = await this.userService.getUserById(userId);

      // Check if the user exists
      if (!user) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'User not found'));
      }

      const dataset = await this.datasetService.getDatasetById(datasetId);

      // Check if the dataset exists
      if (!dataset) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Dataset not found'));
      }

      // Check if the user owns the dataset
      if (dataset.userId !== userId) {
        return next(ErrorFactory.createError(StatusCodes.FORBIDDEN, 'Unauthorized access to dataset'));
      }

      // Check if a file is uploaded
      if (!req.file) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'No file uploaded'));
      }

      const data = req.file.buffer;
      const mimetype = req.file.mimetype;

      // Check if the file type is valid
      if (!ContentService.checkMimetype(type, mimetype)) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid file type'));
      }

      // Calculate the cost of the content
      const cost = await this.contentService.calculateCost(type, data);

      // Check if the file type is valid
      if (cost === null) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid file type'));
      }

      // Check if the file zip is valid
      if (cost === 0) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid zip file'));
      }

      // Check if the user has enough tokens
      if (cost > user.tokens) {
        return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
      }

      // Deduct the cost from the user's tokens
      await this.userService.updateUser(userId, { tokens: user.tokens - cost });

      // Use the filename if provided
      if (req.file.filename) {
        name = req.file.filename;
      }

      const contentData = { ...req.body, cost, data, name };
      return next(ErrorFactory.createError(StatusCodes.CREATED, 'Content created successfully'));
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error'));
    }
  };

  /**
   * Controller method to update content.
   * @param req - The Express request object containing content data.
   * @param res - The Express response object.
   * @returns A JSON response with the updated content or an error message if not found.
   */
  public updateContent = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
    if (isNaN(id)) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid ID. ID must be a number'));
    }

    try {
      const content = await this.contentService.updateContent(id, req.body);

      if (content) {
        res.json(content);
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Content not found'));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update content'));
    }
  };

  /**
   * Controller method to delete content.
   * @param req - The Express request object containing content ID.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of content deletion.
   */
  public deleteContent = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
    if (isNaN(id)) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, 'Invalid ID. ID must be a number'));
    }

    try {
      const success = await this.contentService.deleteContent(id);

      if (success) {
        res.status(StatusCodes.OK).end();  // Successfully deleted, no content to return
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, 'Content not found'));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete content'));
    }
  };
}

// Export the ContentController class
export default ContentController;
