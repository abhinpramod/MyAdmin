const User = require("../model/user.js");
const sendEmail = require("../lib/mailer.js");

// Backend controller (Node.js/Express)
const allusers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status === 'blocked') query.isBlocked = true;
    if (status === 'active') query.isBlocked = false;

    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get data with pagination
    const [data, total] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + parseInt(limit) < total
      }
    });
  } catch (error) {
    console.error('Error in allusers:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false
      }
    });
  }
};
const toggleBlockStatus = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from the URL
    const { isBlocked } = req.body; // Extract isBlocked from request body

    // Find the user by ID and update isBlocked status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true } // Returns the updated user
    );
    const userName = updatedUser.fullname;
    const email = updatedUser.email;
    const subject = `Account ${isBlocked ? "blocked" : "unblocked"}`;
    const text = `Hello ${userName},\n\nYour account has been ${
      isBlocked ? "blocked" : "unblocked"
    }.\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user block status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  allusers,
  toggleBlockStatus,
};
