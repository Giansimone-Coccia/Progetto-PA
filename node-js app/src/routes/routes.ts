import { Router } from 'express';
import multer from 'multer';
import UserController from '../controllers/userController';
import InferenceController from '../controllers/inferenceController';
import DatasetController from '../controllers/datasetController';
import ContentController from '../controllers/contentController';
import AuthController from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeAdmin } from '../middleware/isAdminMiddleware';

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
router.get('/users', authenticateJWT, authorizeAdmin, userController.getAllUsers); //opzionale
router.get('/users/:id', authenticateJWT, authorizeAdmin, userController.getUserById); //opzionale
router.post('/users', authenticateJWT, userController.createUser); //opzionale
router.put('/users/:id', authenticateJWT, userController.updateUser); //opzionale
router.delete('/users/:id', authenticateJWT, userController.deleteUser); //opzionale
router.post('/users/token', authenticateJWT, userController.getToken);

// Rotte di inferenze (protette)
router.get('/inferences', authenticateJWT, inferenceController.getAllInferences);
router.get('/inferences/:id', authenticateJWT, inferenceController.getInferenceById);
router.post('/inferences', authenticateJWT, inferenceController.createInference);
router.put('/inferences/:id', authenticateJWT, inferenceController.updateInference);
router.delete('/inferences/:id', authenticateJWT, inferenceController.deleteInference);
router.post('/start-inference', authenticateJWT, inferenceController.startInference); //sicura
router.get('/status/:processId', authenticateJWT, inferenceController.getStatus); //sicura

// Rotte dataset (protette)
router.get('/datasets', authenticateJWT, datasetController.getAllDatasets);
//router.get('/datasets', authenticateJWT, datasetController.getAllDatasetsByUserId); //opzionale
router.get('/datasets/:id', authenticateJWT, datasetController.getDatasetById); //opzionale
router.post('/datasets', authenticateJWT, datasetController.createDataset);
router.put('/datasets/:id', authenticateJWT, datasetController.updateDataset);
router.delete('/datasets/:id', authenticateJWT, datasetController.deleteDataset);

// Rotte contenuti (protette)
router.get('/contents', authenticateJWT, contentController.getAllContents); //opzionale
router.get('/contents/:id', authenticateJWT, contentController.getContentById); //opzionale
router.post('/contents', authenticateJWT, upload.single('data'), contentController.createContent);
router.put('/contents/:id', authenticateJWT, contentController.updateContent); //opzionale
router.delete('/contents/:id', authenticateJWT, contentController.deleteContent); //opzionale

export default router;
