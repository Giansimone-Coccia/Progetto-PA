import { Request, Response, NextFunction } from 'express';
import { InferenceService } from '../services/inferenceService';
import { CustomRequest } from '../middleware/authMiddleware';
import inferenceQueue from '../queue/inferenceQueue';
import { StatusCodes } from 'http-status-codes';
import ErrorFactory from '../error/errorFactory';
import { DatasetService } from '../services/datasetService';
import { ContentService } from '../services/contentService';
import { UserService } from '../services/userService';
import { ErrorMessages } from '../error/errorMessages';

/**
 * Controller class for managing inference operations.
 * Provides methods for CRUD operations on inferences and job handling.
 */
class InferenceController {
  private static instance: InferenceController;  // Singleton instance of the class
  private readonly inferenceService: InferenceService;    // Service for managing inferences
  private readonly datasetService: DatasetService;
  private readonly contentService: ContentService;
  private readonly userService: UserService;

  /**
   * Private constructor to implement the Singleton pattern.
   * Initializes InferenceService instance.
   */
  private constructor() {
    this.inferenceService = InferenceService.getInstance();  // Get the singleton instance of InferenceService
    this.datasetService = DatasetService.getInstance();  // Get the singleton instance of DatasetService
    this.contentService = ContentService.getInstance();  // Get the singleton instance of ContentService
    this.userService = UserService.getInstance();  // Get the singleton instance of UserService
  }

  /**
   * Static method to get the singleton instance of InferenceController.
   * @returns The singleton instance of InferenceController.
   */
  public static getInstance(): InferenceController {
    if (!InferenceController.instance) {
      InferenceController.instance = new InferenceController();
    }
    return InferenceController.instance;
  }

  /**
   * Controller method to get all inferences.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with all inferences retrieved from the database.
   */
  public getAllInferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inferences = await this.inferenceService.getAllInferences();
      res.json(inferences);
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.FAILED_RETRIVE_INFERENCES));
    }
  };

  /**
   * Controller method to get an inference by ID.
   * @param req - The Express request object containing the inference ID.
   * @param res - The Express response object.
   * @returns A JSON response with the inference retrieved by its ID or an error message if not found or not completed.
   */
  public getInferenceById = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    try {
      // Check if the ID is valid
      if (!id) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_ID));
      }

      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.INVALID_USER_ID });
      }

      // Get the inference from the service
      const inference = await this.inferenceService.getInferenceById(id);

      // Check if the inference exists
      if (!inference) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.INFERENCES_NOT_FOUND });
      }

      const dataset = await this.datasetService.getDatasetById(inference.datasetId);

      if (dataset?.userId !== userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED_ACCESS_DATASET });
      }

      res.json(inference);
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INFERENCES_FETCH_FAILED));
    }
  };

  /**
   * Controller method to create a new inference.
   * @param req - The Express request object containing inference data.
   * @param res - The Express response object.
   * @returns A JSON response with the newly created inference or an error message if creation fails.
   */
  public createInference = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inference = await this.inferenceService.createInference(req.body);
      res.status(StatusCodes.CREATED).json(inference);
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INFERENCES_CREATION_FAILED));
    }
  };

  /**
   * Controller method to update an inference.
   * @param req - The Express request object containing inference data.
   * @param res - The Express response object.
   * @returns A JSON response with the updated inference or an error message if update fails.
   */
  public updateInference = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
    if (isNaN(id)) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_ID));
    }

    try {
      const inference = await this.inferenceService.updateInference(id, req.body);
      if (inference) {
        res.json(inference);
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, ErrorMessages.INFERENCES_NOT_FOUND));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INFERENCES_UPDATE_FAILED));
    }
  };

  /**
   * Controller method to delete an inference.
   * @param req - The Express request object containing inference ID.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of inference deletion.
   */
  public deleteInference = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
    if (isNaN(id)) {
      return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_ID));
    }

    try {
      const success = await this.inferenceService.deleteInference(id);
      if (success) {
        res.status(StatusCodes.NO_CONTENT).end();  // Successfully deleted, no content to return
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, ErrorMessages.INFERENCES_NOT_FOUND));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INFERENCES_DELETE_FAILED));
    }
  };

  /**
   * Controller method to start an inference process.
   * @param req - The Express request object containing datasetId and modelId.
   * @param res - The Express response object.
   * @returns A JSON response with the job ID of the inference process or an error message if execution fails.
   */
  public startInference = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { datasetId, modelId } = req.body;
    const userId = req.user?.id;

    try {

      // Authorization check: Ensure userId is provided
      if (!userId) {
        return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, ErrorMessages.INVALID_ID));
      }

      // Validation checks: Ensure datasetId and modelId are provided
      if (!datasetId || !modelId) {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.DID_MID_REQUIRED));
      }

      // Validation checks: Ensure modelId is correct
      if (modelId !== '1' && modelId !== '2' && modelId !== '3') {
        return next(ErrorFactory.createError(StatusCodes.BAD_REQUEST, ErrorMessages.MODEL_ID_1_2_3));
      }

      // Fetch dataset by datasetId
      const dataset = await this.datasetService.getDatasetById(datasetId);

      // Dataset existence check
      if (!dataset || dataset.isDeleted === true) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, ErrorMessages.DATASET_NOT_FOUND));
      }

      // Authorization check: Ensure userId has access to the dataset
      if (dataset.userId !== userId) {
        return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED_ACCESS_DATASET));
      }

      // Fetch contents associated with the dataset
      const contents = await this.contentService.getContentByDatasetId(datasetId);

      // Contents validation: Ensure contents are not null or undefined
      if (!contents) {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, ErrorMessages.CONTENT_NOT_FOUND));
      }

      // Calculate the cost of inference based on contents
      const cost = await this.contentService.calculateInferenceCost(contents);

      // Fetch user by userId
      const user = await this.userService.getUserById(userId);

      // User existence check
      if (!user) {
        return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED));
      }

      // Token check: Ensure user has sufficient tokens to perform the inference
      if (cost > (user.tokens || 0)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          state: "aborted",
          message: "Not enough tokens"
        });
      }

      // Add the inference job to the queue
      const job = await inferenceQueue.add({ datasetId, modelId, userId, cost, contents, user });
      const jobId = job.id;

      return res.json({ "inference_job_id": jobId });
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.ERROR_INFERENCE));
    }
  };

  /**
   * Controller method to get the status of an inference job.
   * @param req - The Express request object containing job ID.
   * @param res - The Express response object.
   * @returns A JSON response with the status of the inference job or an error message if retrieval fails.
   */
  public getStatus = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const jobId = req.params.jobId;
    const userId = req.user?.id;

    try {
      const job = await inferenceQueue.getJob(jobId);
      if (job) {
        const progress = job.progress();
        const result = job.returnvalue;

        const dataset = await this.datasetService.getDatasetById(progress["datasetId"])

        if(dataset?.userId !== userId){
          return next(ErrorFactory.createError(StatusCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED));
        }

        // Check the state of the job
        if (!progress["state"]) {
          return res.json({
            jobId: job.id,
            state: "pending",
            message: "Job in queue",
          });
        } else if (progress["state"] === "completed") {
          return res.json({
            jobId: job.id,
            state: progress["state"],
            message: progress["message"],
            result
          });
        } else {
          return res.status(progress["error_code"]).json({
            jobId: job.id,
            state: progress["state"],
            message: progress["message"]
          });
        }
      } else {
        return next(ErrorFactory.createError(StatusCodes.NOT_FOUND, ErrorMessages.JOB_NOT_FOUND));
      }
    } catch (error) {
      next(ErrorFactory.createError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.ERROR_JOB_STATUS));
    }
  };
}

// Export the InferenceController class
export default InferenceController;
