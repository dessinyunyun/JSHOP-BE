import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  verifyToken,
} from '../controllers/userController';
import { validateUserInput } from '../middleware/validation';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

router.post('/register', validateUserInput, register);
router.post('/login', login);

router.get('/verify', isAuthenticated, verifyToken);

router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, validateUserInput, updateProfile);

export default router;
