const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const sendEmail = require("../lib/mailer.js");
const uuid = require("uuid");
const logger = require("../lib/logger.js"); // Assuming you have a logger setup
const { userValidationSchema, updateUserValidationSchema } = require("../validations/userValidation.js");

// Helper function to generate unique ID
const generateUniqueId = async () => {
  let uniqueId;
  let isUnique = false;
  
  while (!isUnique) {
    uniqueId = uuid.v4().slice(2, 8);
    const exists = await User.findOne({ uniqueId });
    if (!exists) isUnique = true;
  }
  
  return uniqueId;
};

// Get all users with pagination and filtering
const allusers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, startDate, endDate, role } = req.query;
    const skip = (page - 1) * limit;

    // Build query with input sanitization
    const query = {};
    
    if (search) {
      const sanitizedSearch = search.replace(/[^\w\s]/gi, '');
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } },
        { phone: { $regex: sanitizedSearch, $options: 'i' } }
      ];
    }

    // Status filter
    if (status === 'blocked') query.isBlocked = true;
    if (status === 'active') query.isBlocked = false;

    // Role filter
    if (role) query.role = role;

    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const date = new Date(startDate);
        if (isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date format"
          });
        }
        query.createdAt.$gte = date;
      }
      if (endDate) {
        const date = new Date(endDate);
        if (isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date format"
          });
        }
        query.createdAt.$lte = date;
      }
    }

    // Get data with pagination
    const [data, total] = await Promise.all([
      User.find(query)
        .select('-password -__v') // Exclude sensitive fields
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
    logger.error('Error in allusers:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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

    // Prevent self-blocking
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ 
        success: false, 
        message: "You cannot block yourself" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select('-password -__v');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Send notification email
    try {
      const subject = `Account ${isBlocked ? "Blocked" : "Unblocked"}`;
      const text = `Hello ${updatedUser.name},\n\nYour account has been ${
        isBlocked ? "blocked" : "unblocked"
      }.\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;
      await sendEmail(updatedUser.email, subject, text);
    } catch (emailError) {
      logger.error('Failed to send status email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Error updating user block status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    // Validate input
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, phone, password } = req.body;

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Validate phone number if provided
    if (phone && !/^[\d\s\-()+]{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format"
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
      uniqueId: await generateUniqueId()
    });

    await newUser.save();

    // Send welcome email
    try {
      const subject = "Welcome to Our Platform";
      const text = `Hello ${name},\n\nYour account has been successfully created.\n\nEmail: ${email}\n\nThank you,\nOur Team`;
      await sendEmail(email, subject, text);
    } catch (emailError) {
      logger.error('Failed to send welcome email:', emailError);
    }

    // Return user data without sensitive fields
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse
    });
  } catch (error) {
    logger.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    // Validate input
    const { error } = updateUserValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { userId } = req.params;
    const { name, phone, password } = req.body;

    // Check for empty password
    if (password && password.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Password cannot be empty"
      });
    }

    // Prepare update data
    const updateData = { name, phone };

    // Update password if provided
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters"
        });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password -__v');

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
    logger.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  allusers,
  toggleBlockStatus,
  createUser,
  updateUser
};