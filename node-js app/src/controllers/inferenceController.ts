import { Request, Response } from 'express';
import { InferenceService } from '../services/inferenceService';
import { CustomRequest } from '../middleware/authMiddleware';
import inferenceQueue from '../queue/inferenceQueue';

/**
 * Controller class for managing inference operations.
 * Provides methods for CRUD operations on inferences and job handling.
 */
class InferenceController {
  private static instance: InferenceController;  // Singleton instance of the class
  private inferenceService: InferenceService;    // Service for managing inferences

  /**
   * Private constructor to implement the Singleton pattern.
   * Initializes InferenceService instance.
   */
  private constructor() {
    this.inferenceService = InferenceService.getInstance();  // Get the singleton instance of InferenceService
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
  public getAllInferences = async (req: Request, res: Response) => {
    const inferences = await this.inferenceService.getAllInferences();
    res.json(inferences);
  };

  /**
   * Controller method to get an inference by ID.
   * @param req - The Express request object containing the inference ID.
   * @param res - The Express response object.
   * @returns A JSON response with the inference retrieved by its ID or an error message if not found or not completed.
   */
  public getInferenceById = async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);
    try {
      // Check if the ID is valid
      if (!id) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      // Get the inference from the service
      const inference = await this.inferenceService.getInferenceById(id);

      // Check if the inference exists
      if (!inference) {
        return res.status(404).json({ message: 'Inference not found or not completed' });
      }

      res.json(inference);
    } catch (error) {
      console.error(`Error fetching inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Controller method to create a new inference.
   * @param req - The Express request object containing inference data.
   * @param res - The Express response object.
   * @returns A JSON response with the newly created inference or an error message if creation fails.
   */
  public createInference = async (req: Request, res: Response) => {
    const inference = await this.inferenceService.createInference(req.body);
    res.status(201).json(inference);
  };

  /**
   * Controller method to update an inference.
   * @param req - The Express request object containing inference data.
   * @param res - The Express response object.
   * @returns A JSON response with the updated inference or an error message if update fails.
   */
  public updateInference = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID. ID must be a number' });
    }

    try {
      const inference = await this.inferenceService.updateInference(id, req.body);
      if (inference) {
        res.json(inference);
      } else {
        res.status(404).json({ message: 'Inference not found' });
      }
    } catch (error) {
      console.error(`Error updating inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Controller method to delete an inference.
   * @param req - The Express request object containing inference ID.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of inference deletion.
   */
  public deleteInference = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    // Check if the ID is valid
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID. ID must be a number' });
    }

    try {
      const success = await this.inferenceService.deleteInference(id);
      if (success) {
        res.status(204).end();  // Successfully deleted, no content to return
      } else {
        res.status(404).json({ message: 'Inference not found' });
      }
    } catch (error) {
      console.error(`Error deleting inference: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Controller method to start an inference process.
   * @param req - The Express request object containing datasetId and modelId.
   * @param res - The Express response object.
   * @returns A JSON response with the job ID of the inference process or an error message if execution fails.
   */
  public startInference = async (req: CustomRequest, res: Response) => {
    const { datasetId, modelId } = req.body;
    const userId = req.user?.id;

    try {
      // Add the inference job to the queue
      const job = await inferenceQueue.add({ datasetId, modelId, userId });
      const jobId = job.id;

      return res.json({ "inference_job_id": jobId });
    } catch (error) {
      console.error(`Error during inference execution: ${error}`);
      res.status(500).send("Error during inference execution");
    }
  };

  /**
   * Controller method to get the status of an inference job.
   * @param req - The Express request object containing job ID.
   * @param res - The Express response object.
   * @returns A JSON response with the status of the inference job or an error message if retrieval fails.
   */
  public getStatus = async (req: CustomRequest, res: Response) => {
    const jobId = req.params.jobId;

    try {
      const job = await inferenceQueue.getJob(jobId);
      if (job) {
        const progress = job.progress();
        const result = job.returnvalue;

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
          return res.status(200).json({
            jobId: job.id,
            state: progress["state"],
            message: progress["message"]
          });
        }
      } else {
        return res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving job status', error });
    }
  };
}

// Export the InferenceController class
export default InferenceController;
