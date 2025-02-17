import { InferenceService } from '../services/inferenceService';
import axios from 'axios';
import { ContentService } from '../services/contentService';
import { UserService } from '../services/userService';
import dotenv from 'dotenv';
import { UserAttributes } from '../models/user';
import { ContentAttributes } from '../models/content';

const Queue = require('bull');

dotenv.config();  // Load environment variables from .env file

// Create a new Bull queue named 'inference' using the provided Redis URI
const inferenceQueue = new Queue('inference', process.env.REDIS_URI);

/**
 * Process jobs from the inference queue asynchronously.
 * This function handles the inference process, interacting with services and updating job status.
 */
inferenceQueue.process(async (job: { data: { datasetId: number; modelId: string; userId: number; cost: number; contents: ContentAttributes[]; user: UserAttributes; }; id: any; progress: (arg0: { state: string; error_code: number; message: string; datasetId: number;}) => void; }) => {
  const {datasetId, modelId, userId, cost, contents, user } = job.data;

  // Initialize service instances using Singleton pattern
  const inferenceService = InferenceService.getInstance();
  const contentService = ContentService.getInstance();
  const userService = UserService.getInstance();

  // Define initial job status
  const jobStatus = {
    state: 'running',
    error_code: 200,
    datasetId: datasetId,
    message: 'Job in progress',
  };

  // Notify job progress with initial status
  await job.progress(jobStatus);

  // Prepare contents in JSON format for the inference service
  const jsonContents = contentService.reduceContents(contents);

  try {
    // Evaluate max content length from environment variable or default to 100MB
    const maxContentLengthStr = process.env.MAX_CONTENT_LENGTH || "100 * 1024 * 1024";
    const maxContentLength = eval(maxContentLengthStr);

    // Make POST request to inference service endpoint
    const response = await axios.post(`${process.env.INFERENCE_URL}/predict`, { jsonContents, modelId }, {
      maxContentLength: maxContentLength, // Max content length allowed in the request
      maxBodyLength: maxContentLength // Max body length allowed in the request
    });

    // Handle response from the inference service
    if (response.data && response.data.hasOwnProperty('error') && response.data.hasOwnProperty('error_code')) {
      jobStatus.state = 'failed';
      jobStatus.error_code = response.data.error_code;
      jobStatus.message = `${response.data.error}`;
      job.progress(jobStatus);
      return;
    }

    // Update user tokens after deducting the inference cost
    const tokens = user.tokens - cost;
    await userService.updateUser(userId, { tokens });

    // Create an inference record using the Inference service
    const inference = await inferenceService.createInference({ ...job.data, cost, result: response.data, model: modelId });

    // Finalize job status as completed
    jobStatus.state = 'completed';
    jobStatus.message = 'Job completed';
    job.progress(jobStatus);

    // Return the created inference object
    return inference;
  } catch (error) {
    // Handle errors that occur during the inference process
    jobStatus.state = 'failed';
    jobStatus.error_code = 500;
    jobStatus.message = `Error: ${error}`;
    job.progress(jobStatus);
    return;
  }
});

// Export the inferenceQueue for use in other parts of the application
export default inferenceQueue;
