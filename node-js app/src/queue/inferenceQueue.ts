import Bull from 'bull';
import { InferenceService } from '../services/inferenceService';
import InferenceRepositoryImpl from '../repositories/implementations/inferenceRepositoryImpl';
import DatasetRepositoryImpl from '../repositories/implementations/datasetRepositoryImpl';
import ContentRepositoryImpl from '../repositories/implementations/contentRepositoryImpl';
import UserRepositoryImpl from '../repositories/implementations/userRepositoryImpl';
import InferenceDAO from '../dao/implementations/inferenceDAOImpl';
import axios from 'axios';
import { ContentService } from '../services/contentService';
import ContentDAO from '../dao/implementations/contentDAOImpl';
import DatasetDAO from '../dao/implementations/datasetDAOImpl';
import { DatasetService } from '../services/datasetService';
import UserDAO from '../dao/implementations/userDAOImpl';
import { UserService } from '../services/userService';
const Queue = require('bull');


const inferenceQueue = new Queue('inference',
  process.env.REDIS_URI);

inferenceQueue.process(async (job: { data: { datasetId: any; modelId: any; userId: any; }; id: any; progress: (arg0: { state: string; message: string; }) => void; }) => {
  const { datasetId, modelId, userId } = job.data;
  console.log("struolo");

  const inferenceDAO = new InferenceDAO();
  const inferenceRepository = new InferenceRepositoryImpl(inferenceDAO);
  const inferenceService = new InferenceService(inferenceRepository);

  const contentDAO = new ContentDAO();
  const contentRepository = new ContentRepositoryImpl(contentDAO);
  const contentService = new ContentService(contentRepository);

  const datasetDAO = new DatasetDAO();
  const datasetRepository = new DatasetRepositoryImpl(datasetDAO);
  const datasetService = new DatasetService(datasetRepository);

  const userDAO = new UserDAO();
  const userRepository = new UserRepositoryImpl(userDAO);
  const userService = new UserService(userRepository);

  const inferenceUrl = process.env.INFERENCE_URL;

  const jobStatus = {
    state: 'running',
    message: 'Job in esecuzione',
  };

  await job.progress(jobStatus);

  if (!userId) {
    jobStatus.state = 'failed';
    jobStatus.message = 'Error 401: Unauthorized';
    job.progress(jobStatus);
    return;
  }

  if (!datasetId || !modelId) {
    jobStatus.state = 'failed';
    jobStatus.message = 'Error 400: datasetId e modelId sono richiesti';
    job.progress(jobStatus);
    return;
  }

  const dataset = await datasetService.getDatasetById(datasetId);

  if (!dataset) {
    jobStatus.state = 'failed';
    jobStatus.message = 'Error 404: Dataset not found';
    job.progress(jobStatus);
    return;
  }

  if (dataset.userId !== userId) {
    jobStatus.state = 'failed';
    jobStatus.message = 'Error 403: Unauthorized access to dataset';
    job.progress(jobStatus);
    return;
  }

  const contents = await contentService.getContentByDatasetId(datasetId);

  if (contents == null || contents === undefined) {
    jobStatus.state = 'failed';
    jobStatus.message = 'Error 404: Il servizio getContentByDatasetId ha restituito un valore null o undefined.';
    job.progress(jobStatus);
    return;
  }

  const cost = contentService.calculateInferenceCost(contents);
  const user = await userService.getUserById(userId);

  if (!user) {
    jobStatus.state = 'failed';
    jobStatus.message = 'Error 401: Unauthorized';
    job.progress(jobStatus);
    return;
  }

  if (cost > user.tokens) {
    jobStatus.state = 'aborted';
    jobStatus.message = 'Error 401: Unauthorized';
    job.progress(jobStatus);
    return;
  }

  const jsonContents = contentService.reduceContents(contents);

  console.log("yolo")
  try {
    const response = await axios.post(`${inferenceUrl}/predict`, { jsonContents, modelId });
    if (response.data && response.data.hasOwnProperty('error') && response.data.hasOwnProperty('error_code')) {
      jobStatus.state = 'failed';
      jobStatus.message = `Error ${response.data.error_code}: ${response.data.error}`;
      job.progress(jobStatus);
    }

    let tokens = user.tokens - cost

    await userService.updateUser(userId, { tokens });

    console.log({ ...job.data, cost, status: 'completed', response });

    const inference = await inferenceService.createInference({ ...job.data, cost, status: 'completed', result: response.data, model: modelId });

    jobStatus.state = 'completed';
    jobStatus.message = 'job completato';
    job.progress(jobStatus);
    return inference;
  } catch (error) {
    jobStatus.state = 'failed';
    jobStatus.message = 'error';
    job.progress(jobStatus);
    return;
  }
});


export default inferenceQueue;
