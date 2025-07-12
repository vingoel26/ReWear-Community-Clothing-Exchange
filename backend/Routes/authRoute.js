import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  changePassword 
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { 
  validateRegister, 
  validateLogin, 
  validateChangePassword 
} from '../middlewares/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);


//admins or change
router.get('/me', protect, getCurrentUser);
router.put('/change-password', protect, validateChangePassword, changePassword);

export default router;