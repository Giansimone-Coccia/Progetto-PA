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

const upload = multer();

// Inizializzazione dei controller
const userController = new UserController();
const inferenceController = new InferenceController();
const datasetController = new DatasetController();
const contentController = new ContentController();
const authController = new AuthController();

// Rotte di autenticazione
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotte utente (protette)
router.get('/users', authenticateJWT, authorizeAdmin, userController.getAllUsers); //opzionale
router.get('/users/:id', authenticateJWT, authorizeAdmin, userController.getUserById); //opzionale
router.post('/users', authenticateJWT, userController.createUser); //opzionale
router.put('/users/:id', authenticateJWT, userController.updateUser); //opzionale
router.delete('/users/:id', authenticateJWT, userController.deleteUser); //opzionale

// Rotte di inferenze (protette)
router.get('/inferences', authenticateJWT, inferenceController.getAllInferences);
router.get('/inferences/:id', authenticateJWT, inferenceController.getInferenceById);
router.post('/inferences', authenticateJWT, inferenceController.createInference);
router.put('/inferences/:id', authenticateJWT, inferenceController.updateInference);
router.delete('/inferences/:id', authenticateJWT, inferenceController.deleteInference);

// Rotte dataset (protette)
router.get('/datasets', authenticateJWT, datasetController.getAllDatasets);
//router.get('/datasets', authenticateJWT, datasetController.getAllDatasetsByUserId); //opzionale
router.get('/datasets/:id', authenticateJWT, datasetController.getDatasetById); //opzionale
router.post('/datasets', authenticateJWT, datasetController.createDataset);
router.put('/datasets/:id', authenticateJWT, datasetController.updateDataset);
router.delete('/datasets/:id', authenticateJWT, datasetController.deleteDataset);

// Rotta per il caricamento di un'immagine
//router.post('/upload-image', authenticateJWT, upload.single('image'), contentController.uploadImage);

// Rotte contenuti (protette)
router.get('/contents', authenticateJWT, contentController.getAllContents); //opzionale
router.get('/contents/:id', authenticateJWT, contentController.getContentById); //opzionale
router.post('/contents', authenticateJWT, contentController.createContent);
router.put('/contents/:id', authenticateJWT, contentController.updateContent); //opzionale
router.delete('/contents/:id', authenticateJWT, contentController.deleteContent); //opzionale

export default router;
