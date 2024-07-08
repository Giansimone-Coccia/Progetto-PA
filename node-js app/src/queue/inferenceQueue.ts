import { InferenceService } from '../services/inferenceService';
import axios from 'axios';
import { ContentService } from '../services/contentService';
import { DatasetService } from '../services/datasetService';
import { UserService } from '../services/userService';
const Queue = require('bull');


const inferenceQueue = new Queue('inference',
  process.env.REDIS_URI);

inferenceQueue.process(async (job: { data: { datasetId: any; modelId: any; userId: any; }; id: any; progress: (arg0: { state: string; message: string; }) => void; }) => {
  const { datasetId, modelId, userId } = job.data;

  const inferenceService = InferenceService.getInstance();
  const contentService = ContentService.getInstance();
  const datasetService = DatasetService.getInstance();
  const userService = UserService.getInstance();

  const inferenceUrl = process.env.INFERENCE_URL;

  const jobStatus = {
    state: 'running',
    error_code: 0,
    message: 'Job in esecuzione',
  };

  await job.progress(jobStatus);

  if (!userId) {
    jobStatus.state = 'failed';
    jobStatus.error_code = 401;
    jobStatus.message = 'Error 401: Unauthorized';
    job.progress(jobStatus);
    return;
  }

  if (!datasetId || !modelId) {
    jobStatus.state = 'failed';
    jobStatus.error_code = 400;
    jobStatus.message = 'Error 400: datasetId e modelId sono richiesti';
    job.progress(jobStatus);
    return;
  }

  const dataset = await datasetService.getDatasetById(datasetId);

  if (!dataset) {
    jobStatus.state = 'failed';
    jobStatus.error_code = 404;
    jobStatus.message = 'Error 404: Dataset not found';
    job.progress(jobStatus);
    return;
  }

  if (dataset.userId !== userId) {
    jobStatus.state = 'failed';
    jobStatus.error_code = 403;
    jobStatus.message = 'Error 403: Unauthorized access to dataset';
    job.progress(jobStatus);
    return;
  }

  const contents = await contentService.getContentByDatasetId(datasetId);

  if (contents == null || contents === undefined) {
    jobStatus.state = 'failed';
    jobStatus.error_code = 404;
    jobStatus.message = 'Error 404: Il servizio getContentByDatasetId ha restituito un valore null o undefined.';
    job.progress(jobStatus);
    return;
  }

  const cost = contentService.calculateInferenceCost(contents);
  const user = await userService.getUserById(userId);

  if (!user) {
    jobStatus.state = 'failed';
    jobStatus.error_code = 401;
    jobStatus.message = 'Error 401: Unauthorized';
    job.progress(jobStatus);
    return;
  }

  if (cost > user.tokens) {
    jobStatus.state = 'aborted';
    jobStatus.error_code = 401;
    jobStatus.message = 'Error 401: Unauthorized';
    job.progress(jobStatus);
    return;
  }

  const jsonContents = contentService.reduceContents(contents);

  try {
    const response = await axios.post(`${inferenceUrl}/predict`, { jsonContents, modelId });

    if (response.data && response.data.hasOwnProperty('error') && response.data.hasOwnProperty('error_code')) {
      jobStatus.state = 'failed';
      jobStatus.error_code = response.data.error_code;
      jobStatus.message = `Error ${response.data.error_code}: ${response.data.error}`;
      job.progress(jobStatus);
      return;
    }

    let tokens = user.tokens - cost

    await userService.updateUser(userId, { tokens });

    const inference = await inferenceService.createInference({ ...job.data, cost, result: response.data, model: modelId });

    jobStatus.state = 'completed';
    jobStatus.message = 'job completato';
    job.progress(jobStatus);
    return inference;
  } catch (error) {
    jobStatus.state = 'failed';
    jobStatus.error_code = 500;
    jobStatus.message = `Error: ${error}`;
    job.progress(jobStatus);
    return;
  }
});


export default inferenceQueue;
