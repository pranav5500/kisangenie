import express from 'express';
import { recommendFertilizer, getFertilizerHistory, deleteFertilizerRecommendation } from '../controllers/fertilizerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/recommend')
  .post(protect, recommendFertilizer);

router.route('/history')
  .get(protect, getFertilizerHistory);

router.route('/:id')
  .delete(protect, deleteFertilizerRecommendation);

export default router;
