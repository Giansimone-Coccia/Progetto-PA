import { Router } from 'express';
import * as UserController from '../controllers/UserController'
import * as InferenceController from '../controllers/InferenceController';
import * as DatasetController from '../controllers/DatasetController';
import * as ContentController from '../controllers/ContentController';

const router = Router();

router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

router.get('/inferences', InferenceController.getAllInferences);
router.get('/inferences/:id', InferenceController.getInferenceById);
router.post('/inferences', InferenceController.createInference);
router.put('/inferences/:id', InferenceController.updateInference);
router.delete('/inferences/:id', InferenceController.deleteInference);

router.get('/datasets', DatasetController.getAllDatasets);
router.get('/datasets/:id', DatasetController.getDatasetById);
router.post('/datasets', DatasetController.createDataset);
router.put('/datasets/:id', DatasetController.updateDataset);
router.delete('/datasets/:id', DatasetController.deleteDataset);

router.get('/contents', ContentController.getAllContents);
router.get('/contents/:id', ContentController.getContentById);
router.post('/contents', ContentController.createContent);
router.put('/contents/:id', ContentController.updateContent);
router.delete('/contents/:id', ContentController.deleteContent);

export default router;
