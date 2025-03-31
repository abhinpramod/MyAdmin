const sendEmail = require('../lib/mailer');
const Store = require('../model/store.model');

// Get all stores with optional filtering
exports.getStores = async (req, res) => {
  try {
    const { filter, page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build the query based on filters
    let query = {};
    
    // Apply status filter if not 'all'
    if (filter && filter !== 'all') {
      if (filter === 'pending') {
        query.approvelstatus = 'Pending';
        query.isBlocked = false;
      } else if (filter === 'approved') {
        query.approvelstatus = 'Approved';
        query.isBlocked = false;
      } else if (filter === 'blocked') {
        query.isBlocked = true;
      }
    }

    // Apply search if provided
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { storeName: searchRegex },
        { ownerName: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { country: searchRegex },
        { address: searchRegex },
        { phone: searchRegex },
        { gstNumber: searchRegex }
      
      ];
    }

    const stores = await Store.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Store.countDocuments(query);

    res.json({
      stores,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve a store
exports.approveStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { approvelstatus : "Approved", isBlocked: false, rejectionReason: null },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    sendEmail(store.email, "Account Approved", "Your account has been approved.");

    res.json({ message: 'Store approved successfully', store });
  } catch (error) {
    console.error('Error approving store:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject a store
exports.rejectStore = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { approvelstatus : "Rejected", isBlocked: false, rejectionReason },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    sendEmail(store.email, "Account Rejected", `Your account has been rejected. Reason: ${rejectionReason}`);

    res.json({ message: 'Store rejected successfully', store });
  } catch (error) {
    console.error('Error rejecting store:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Block a store
exports.blockStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }


    sendEmail(store.email, "Account Blocked", "Your account has been blocked.connect admin.");
    res.json({ message: 'Store blocked successfully', store });

  } catch (error) {
    console.error('Error blocking store:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unblock a store
exports.unblockStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json({ message: 'Store unblocked successfully', store });
    sendEmail(store.email, "Account Unblocked", "Your account has been unblocked.");
  } catch (error) {
    console.error('Error unblocking store:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
