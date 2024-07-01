import express from 'express';
import userRoutes from './user';
import datasetRoutes from './dataset';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/datasets', datasetRoutes);

export default router;
