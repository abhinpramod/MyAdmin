const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { protectRoute } = require("../middleware/authmiddleware");

// app.use(protectRoute);
// Get stores with optional filtering
router.get('/', storeController.getStores);

// Approve a store
router.put('/:id/approve',protectRoute, storeController.approveStore);

router.get('/:id/products',protectRoute, storeController.getProductsByStoreId);

router.get('/:id',protectRoute, storeController.getStoreById);

// Reject a store
router.put('/:id/reject',protectRoute, storeController.rejectStore);

// Block a store
router.put('/:id/block',protectRoute, storeController.blockStore);

// Unblock a store
router.put('/:id/unblock',protectRoute, storeController.unblockStore);

module.exports = router;