import { NextFunction, Router } from 'express';
import multer, { MulterError } from 'multer';
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

// Middleware per gestire gli errori di Multer
/*const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Campo del form non previsto per il caricamento del file' });
    }
  }
  next(err); // Passa l'errore agli altri middleware di gestione degli errori
};*/


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
router.post('/users/recharge', authenticateJWT, authorizeAdmin, userController.creditRecharge);

// Rotte di inferenze (protette)
router.get('/inferences', authenticateJWT, inferenceController.getAllInferences);
router.get('/inferences/:id', authenticateJWT, inferenceController.getInferenceById);
router.post('/inferences', authenticateJWT, inferenceController.createInference);
router.put('/inferences/:id', authenticateJWT, inferenceController.updateInference);
router.delete('/inferences/:id', authenticateJWT, inferenceController.deleteInference);
router.post('/start-inference', authenticateJWT, inferenceController.startInference); //sicura
router.post('/inferences/status', authenticateJWT, inferenceController.getStatus); //sicura

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
router.post('/contents', authenticateJWT, upload.single('data'), errorMulterMiddleware, contentController.createContent);
router.put('/contents/:id', authenticateJWT, contentController.updateContent); //opzionale
router.delete('/contents/:id', authenticateJWT, contentController.deleteContent); //opzionale

export default router;
