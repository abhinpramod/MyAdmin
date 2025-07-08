const User = require("../model/user.js");
const bcrypt = require("bcryptjs");
const sendEmail = require("../lib/mailer.js");
const uuid = require("uuid");

// Get all users with pagination and filtering
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
        .select('-password') // Exclude password field
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

// Toggle user block status
const toggleBlockStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Send notification email
    const subject = `Account ${isBlocked ? "Blocked" : "Unblocked"}`;
    const text = `Hello ${updatedUser.name},\n\nYour account has been ${
      isBlocked ? "blocked" : "unblocked"
    }.\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(updatedUser.email, subject, text);

    res.status(200).json({
      success: true,
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user block status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isBlocked: false,
      uniqueId: uuid.v4().slice(2, 8)

    });

    await newUser.save();

    // Send welcome email
    const subject = "Welcome to Our Platform";
    const text = `Hello ${name},\n\nYour account has been successfully created.\n\nEmail: ${email}\nPassword: ${password}\n\nThank you,\nOur Team`;
    sendEmail(email, subject, text);

    // Return user data without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user"
    });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, password } = req.body;

    // Prepare update data
    const updateData = { name, phone };

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user"
    });
  }
};

module.exports = {
  allusers,
  toggleBlockStatus,
  createUser,
  updateUser
};