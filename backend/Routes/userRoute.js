import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUserProfile, 
  deleteUser, 
  toggleUserStatus, 
  searchUsers 
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/auth.js';
import { validateUpdateProfile } from '../middlewares/validation.js';

const router = express.Router();

router.put('/profile', protect, validateUpdateProfile, updateUserProfile);

router.get('/', protect, admin, getAllUsers);
router.get('/search', protect, admin, searchUsers);
router.get('/:id', protect, admin, getUserById);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/toggle-status', protect, admin, toggleUserStatus);

export default router;