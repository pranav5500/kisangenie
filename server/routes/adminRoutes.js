import express from 'express';
import { getUsers, deleteUser, getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/users')
  .get(protect, admin, getUsers);

router.route('/user/:id')
  .delete(protect, admin, deleteUser);

router.route('/dashboard')
  .get(protect, admin, getDashboardStats);

export default router;
