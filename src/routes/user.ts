import express from 'express';
import { createUser, loginUser, getUserTokens } from '../controllers/userController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.get('/tokens', auth, getUserTokens);

export default router;


