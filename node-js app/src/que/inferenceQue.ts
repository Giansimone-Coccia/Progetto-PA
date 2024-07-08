import Bull from 'bull';
import { InferenceService } from '../services/inferenceService';
import InferenceRepositoryImpl from '../repositories/implementations/inferenceRepositoryImpl';
import InferenceDAO from '../dao/implementations/inferenceDAOImpl';
import axios from 'axios';

// Configura Redis
const inferenceQueue = new Bull('inference', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

inferenceQueue.process(async (job) => {
  const { datasetId, modelId, userId, processId, token } = job.data;
  
  const inferenceDAO = new InferenceDAO();
  const inferenceRepository = new InferenceRepositoryImpl(inferenceDAO);
  const inferenceService = InferenceService.getInstance(inferenceRepository);
  const inferenceUrl = process.env.INFERENCE_URL;

  // Logica per l'esecuzione dell'inferenza
  const response = await axios.post(`${inferenceUrl}/predict`, { datasetId, modelId, token });
  const result = response.data;

  await inferenceService.updateInference(processId, {
    status: 'completed',
    result: result,
    updatedAt: new Date()
  });
  
  return result;
});

export default inferenceQueue;
