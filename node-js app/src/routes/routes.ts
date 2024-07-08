import { Router } from 'express';
import multer from 'multer';
import UserController from '../controllers/userController';
import InferenceController from '../controllers/inferenceController';
import DatasetController from '../controllers/datasetController';
import ContentController from '../controllers/contentController';
import AuthController from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeAdmin } from '../middleware/isAdminMiddleware';
import { errorMulterMiddleware } from '../middleware/errorMulterMiddleware';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Inizializzazione dei controller
const userController = UserController.getInstance();
const inferenceController = InferenceController.getInstance();
const datasetController = DatasetController.getInstance();
const contentController = ContentController.getInstance();
const authController = AuthController.getInstance();

// Rotte di autenticazione
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotte utente (protette)
//router.get('/users', authenticateJWT, authorizeAdmin, userController.getAllUsers);
//router.get('/users/:id', authenticateJWT, authorizeAdmin, userController.getUserById);
//router.post('/users', authenticateJWT, userController.createUser);
//router.put('/users/:id', authenticateJWT, userController.updateUser);
//router.delete('/users/:id', authenticateJWT, userController.deleteUser);
router.post('/users/token', authenticateJWT, userController.getToken);
router.post('/users/recharge', authenticateJWT, authorizeAdmin, userController.creditRecharge);

// Rotte di inferenze (protette)
//router.get('/inferences', authenticateJWT, inferenceController.getAllInferences);
router.get('/inferences/:id', authenticateJWT, inferenceController.getInferenceById);
//router.post('/inferences', authenticateJWT, inferenceController.createInference);
//router.put('/inferences/:id', authenticateJWT, inferenceController.updateInference);
//router.delete('/inferences/:id', authenticateJWT, inferenceController.deleteInference);
router.post('/inferences', authenticateJWT, inferenceController.startInference);
router.get('/inferences/status/:jobId', authenticateJWT, inferenceController.getStatus);

// Rotte dataset (protette)
router.get('/datasets', authenticateJWT, datasetController.getAllDatasets);
//router.get('/datasets', authenticateJWT, datasetController.getAllDatasetsByUserId);
//router.get('/datasets/:id', authenticateJWT, datasetController.getDatasetById);
router.post('/datasets', authenticateJWT, datasetController.createDataset);
router.put('/datasets/:id', authenticateJWT, datasetController.updateDataset);
router.delete('/datasets/:id', authenticateJWT, datasetController.deleteDataset);

// Rotte contenuti (protette)
//router.get('/contents', authenticateJWT, contentController.getAllContents);
//router.get('/contents/:id', authenticateJWT, contentController.getContentById);
router.post('/contents', authenticateJWT, upload.single('data'), errorMulterMiddleware, contentController.createContent);
//router.put('/contents/:id', authenticateJWT, contentController.updateContent);
//router.delete('/contents/:id', authenticateJWT, contentController.deleteContent);

export default router;
