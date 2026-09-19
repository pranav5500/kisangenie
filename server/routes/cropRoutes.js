import express from 'express';
import { recommendCrop, getCropHistory, deleteCropRecommendation } from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/recommend')
  .post(protect, recommendCrop);

router.route('/history')
  .get(protect, getCropHistory);

router.route('/:id')
  .delete(protect, deleteCropRecommendation);

export default router;
