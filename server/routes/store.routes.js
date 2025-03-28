const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');

// Get stores with optional filtering
router.get('/', storeController.getStores);

// Approve a store
router.put('/:id/approve', storeController.approveStore);

// Reject a store
router.put('/:id/reject', storeController.rejectStore);

// Block a store
router.put('/:id/block', storeController.blockStore);

// Unblock a store
router.put('/:id/unblock', storeController.unblockStore);

module.exports = router;