import express from 'express';
import { analyzePlantDisease, getDiseaseHistory, deleteDiseaseReport } from '../controllers/diseaseController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/analyze')
  .post(protect, upload.single('image'), analyzePlantDisease);

router.route('/history')
  .get(protect, getDiseaseHistory);

router.route('/:id')
  .delete(protect, deleteDiseaseReport);

export default router;
