import express from 'express';
import { sendMessage, getChatHistory, deleteChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, sendMessage);

router.route('/history')
  .get(protect, getChatHistory);

router.route('/:id')
  .delete(protect, deleteChat);

export default router;
