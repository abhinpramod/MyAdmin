import Store from '../models/storeModel.js';

// Status query mapping
const statusQueries = {
  pending: { approved: false, isBlocked: false },
  approved: { approved: true, isBlocked: false },
  blocked: { isBlocked: true }
};

// Status update mapping
const statusUpdates = {
  approved: { approved: true, isBlocked: false, rejectionReason: '' },
  rejected: { approved: false, isBlocked: false, rejectionReason: '' },
  blocked: { isBlocked: true }
};

// @desc    Get filtered stores for admin
// @route   GET /api/stores/admin
// @access  Private/Admin
export const getStoresForAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = statusQueries[status] || {};
    
    const stores = await Store.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(stores);
  } catch (error) {
    next(error);
  }
};

// @desc    Update store status
// @route   PATCH /api/stores/:id/status
// @access  Private/Admin
export const updateStoreStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const { id } = req.params;

    if (!statusUpdates[status]) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const update = { ...statusUpdates[status] };
    if (status === 'rejected') update.rejectionReason = reason;

    const updatedStore = await Store.findByIdAndUpdate(id, update, { 
      new: true 
    }).select('-password');
    
    res.json(updatedStore);
  } catch (error) {
    next(error);
  }
};