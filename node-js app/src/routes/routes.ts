import { Router } from 'express';
import multer from 'multer'; // Multer for handling file uploads
import UserController from '../controllers/userController'; // Importing user controller
import InferenceController from '../controllers/inferenceController'; // Importing inference controller
import DatasetController from '../controllers/datasetController'; // Importing dataset controller
import ContentController from '../controllers/contentController'; // Importing content controller
import AuthController from '../controllers/authController'; // Importing authentication controller
import { authenticateJWT } from '../middleware/authMiddleware'; // Middleware for JWT authentication
import { authorizeAdmin } from '../middleware/isAdminMiddleware'; // Middleware to authorize admin actions
import { errorMulterMiddleware } from '../middleware/errorMulterMiddleware'; // Middleware for handling Multer errors

const router = Router(); // Create an instance of Express router

const upload = multer({
  storage: multer.memoryStorage(), // Multer configured to store uploads in memory
});

// Initialize controllers
const userController = UserController.getInstance();
const inferenceController = InferenceController.getInstance();
const datasetController = DatasetController.getInstance();
const contentController = ContentController.getInstance();
const authController = AuthController.getInstance();

// Authentication routes
router.post('/register', authController.register); // Route for user registration
router.post('/login', authController.login); // Route for user login

// User routes (protected)
router.get('/users/token', authenticateJWT, userController.getToken); // Route to get user token
router.put('/users/recharge', authenticateJWT, authorizeAdmin, userController.creditRecharge); // Route to recharge user tokens (admin only)

// Inference routes (protected)
router.get('/inferences/:id', authenticateJWT, inferenceController.getInferenceById); // Route to get inference by ID
router.post('/inferences', authenticateJWT, inferenceController.startInference); // Route to start a new inference
router.get('/inferences/status/:jobId', authenticateJWT, inferenceController.getStatus); // Route to get inference job status

// Dataset routes (protected)
router.get('/datasets', authenticateJWT, datasetController.getAllDatasetsByUserId); // Route to get all datasets by user id
router.get('/datasets/admin', authenticateJWT, authorizeAdmin, datasetController.getAllDatasets); // Route to get all datasets
router.post('/datasets', authenticateJWT, datasetController.createDataset); // Route to create a new dataset
router.put('/datasets/:id', authenticateJWT, datasetController.updateDataset); // Route to update a dataset
router.delete('/datasets/:id', authenticateJWT, datasetController.deleteDataset); // Route to delete a dataset

// Content routes (protected)
router.post('/contents', authenticateJWT, upload.single('data'), errorMulterMiddleware, contentController.createContent); // Route to upload content
// Note: 'data' is the field name used in the form for file upload

export default router;
