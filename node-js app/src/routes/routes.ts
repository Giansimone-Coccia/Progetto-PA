import { Router } from 'express';
import * as UserController from '../controllers/UserController';
import * as InferenceController from '../controllers/InferenceController';
import * as DatasetController from '../controllers/DatasetController';
import * as ContentController from '../controllers/ContentController';
import { register, login } from '../controllers/AuthController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Rotte di autenticazione
router.post('/register', register);
router.post('/login', login);

// Rotte utente (protette)
router.get('/users', authenticateJWT, UserController.getAllUsers);
router.get('/users/:id', authenticateJWT, UserController.getUserById);
router.post('/users', authenticateJWT, UserController.createUser);
router.put('/users/:id', authenticateJWT, UserController.updateUser);
router.delete('/users/:id', authenticateJWT, UserController.deleteUser);

// Rotte di inferenze (protette)
router.get('/inferences', authenticateJWT, InferenceController.getAllInferences);
router.get('/inferences/:id', authenticateJWT, InferenceController.getInferenceById);
router.post('/inferences', authenticateJWT, InferenceController.createInference);
router.put('/inferences/:id', authenticateJWT, InferenceController.updateInference);
router.delete('/inferences/:id', authenticateJWT, InferenceController.deleteInference);

// Rotte dataset (protette)
router.get('/datasets', authenticateJWT, DatasetController.getAllDatasets);
router.get('/datasets/:id', authenticateJWT, DatasetController.getDatasetById);
router.post('/datasets', authenticateJWT, DatasetController.createDataset);
router.put('/datasets/:id', authenticateJWT, DatasetController.updateDataset);
router.delete('/datasets/:id', authenticateJWT, DatasetController.deleteDataset);

// Rotte contenuti (protette)
router.get('/contents', authenticateJWT, ContentController.getAllContents);
router.get('/contents/:id', authenticateJWT, ContentController.getContentById);
router.post('/contents', authenticateJWT, ContentController.createContent);
router.put('/contents/:id', authenticateJWT, ContentController.updateContent);
router.delete('/contents/:id', authenticateJWT, ContentController.deleteContent);

export default router;
