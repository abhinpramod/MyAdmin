import express from 'express';
import {
  getStoresForAdmin,
  updateStoreStatus
} from '../controllers/storeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/admin')
  .get(protect, admin, getStoresForAdmin);

router.route('/:id/status')
  .patch(protect, admin, updateStoreStatus);

export default router;