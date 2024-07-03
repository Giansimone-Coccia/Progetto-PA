import Bull from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const inferenceQueue = new Bull('inference-queue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!, 10),
  },
});

export default inferenceQueue;
