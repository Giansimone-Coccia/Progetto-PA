import { Router } from 'express';
import * as UserController from '../controllers/userController';
import * as InferenceController from '../controllers/inferenceController';
import * as DatasetController from '../controllers/datasetController';
import * as ContentController from '../controllers/contentController';
import { register, login } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeAdmin } from '../middleware/isAdminMiddleware';

const router = Router();

// Rotte di autenticazione
router.post('/register', register);
router.post('/login', login);

// Rotte utente (protette)
router.get('/users', authenticateJWT, authorizeAdmin, UserController.getAllUsers); //opzionale
router.get('/users/:id', authenticateJWT, authorizeAdmin, UserController.getUserById); //opzionale
router.post('/users', authenticateJWT, UserController.createUser); //opzionale
router.put('/users/:id', authenticateJWT, UserController.updateUser); //opzionale
router.delete('/users/:id', authenticateJWT, UserController.deleteUser); //opzionale

// Rotte di inferenze (protette)
router.get('/inferences', authenticateJWT, InferenceController.getAllInferences);
router.get('/inferences/:id', authenticateJWT, InferenceController.getInferenceById);
router.post('/inferences', authenticateJWT, InferenceController.createInference);
router.put('/inferences/:id', authenticateJWT, InferenceController.updateInference);
router.delete('/inferences/:id', authenticateJWT, InferenceController.deleteInference);

// Rotte dataset (protette)
router.get('/datasets', authenticateJWT, DatasetController.getAllDatasets);
//router.get('/datasets', authenticateJWT, DatasetController.getAllDatasetsByUserId); //opzionale
router.get('/datasets/:id', authenticateJWT, DatasetController.getDatasetById); //opzionale
router.post('/datasets', authenticateJWT, DatasetController.createDataset);
router.put('/datasets/:id', authenticateJWT, DatasetController.updateDataset);
router.delete('/datasets/:id', authenticateJWT, DatasetController.deleteDataset);

// Rotte contenuti (protette)
router.get('/contents', authenticateJWT, ContentController.getAllContents); //opzionale
router.get('/contents/:id', authenticateJWT, ContentController.getContentById); //opzionale
router.post('/contents', authenticateJWT, ContentController.createContent);
router.put('/contents/:id', authenticateJWT, ContentController.updateContent); //opzionale
router.delete('/contents/:id', authenticateJWT, ContentController.deleteContent); //opzionale

export default router;
