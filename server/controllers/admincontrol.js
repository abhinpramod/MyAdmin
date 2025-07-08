const Admin = require("../model/admin.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../lib/utils.js");
const sendEmail = require("../lib/mailer.js");

const addadmin = async (req, res) => {
  const { email, password, fullname, role, uniqueId } = req.body;
  console.log(req.body);

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await Admin.findOne({ email });
    if (user) return res.status(400).json({ msg: "Admin already exists" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newadmin = new Admin({
      fullname,
      email,
      password: hashPassword,
      role,
      isBlocked: false,
      uniqueId: uniqueId,
    });

    await newadmin.save();
    const subject = "Welcome to Our Application";
    const text = `Hello ${fullname},\n\nYou have been added as an admin to our application.\n\nPlease use the following credentials to log in:\n\nEmail: ${email}\nPassword: ${password}\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);
    console.log("Email sent:", email, subject, text);

    return res.status(201).json({
      _id: newadmin._id,
      fullname: newadmin.fullname,
      email: newadmin.email,
      role: newadmin.role,
      uniqueId: newadmin.uniqueId,
    });
  } catch (error) {
    console.log("Error from addadmin:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Invalid Email" });

    if (admin.isBlocked)
      return res.status(403).json({ msg: "Your account is blocked" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });
   
    generateToken(admin._id, res);
    res.status(200).json({
      _id: admin._id,
      fullname: admin.fullname,
      email: admin.email,
      role: admin.role,
      uniqueId: admin.uniqueId,
    });
    
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      _id: req.admin._id,
      fullname: req.admin.fullname,
      email: req.admin.email,
      role: req.admin.role,
      uniqueId: req.admin.uniqueId,
    });
  } catch (error) {
    console.log("error from checkAuth", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// Get all admins
const getalladmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: { $ne: "superadmin" } });
    res.status(200).json(admins);
  } catch (error) {
    console.log("error from getalladmins", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// Block an admin by ID
const blockAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    admin.isBlocked = true;
    await admin.save();
    sendEmail(admin.email, "Account Blocked", "Your account has been blocked.");

    res.status(200).json({ msg: "Admin blocked successfully" });
  } catch (error) {
    console.error("Error blocking admin:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Edit admin details
const editAdmin = async (req, res) => {
  const { adminId } = req.params;
  const { fullname, password, role } = req.body;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    // Update fullname if provided
    if (fullname) admin.fullname = fullname;

    // Update role if provided
    if (role) admin.role = role;

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters" });
      }
      const salt = await bcrypt.genSalt();
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();

    res.status(200).json({ 
      msg: "Admin updated successfully",
      updatedAdmin: {
        _id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role,
        uniqueId: admin.uniqueId
      }
    });
  } catch (error) {
    console.error("Error updating admin:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Unblock an admin
const unblockAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    admin.isBlocked = false;
    await admin.save();
    sendEmail(admin.email, "Account Unblocked", "Your account has been unblocked.");

    res.json({ msg: "Admin unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking admin:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ msg: "Logout success" });
  } catch (error) {
    console.log("error from logout", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    // Prevent deletion of superadmin (if needed)
    if (admin.role === "superadmin") {
      return res.status(403).json({ msg: "Cannot delete superadmin" });
    }

    await Admin.findByIdAndDelete(adminId);
    
    // Send notification email
    sendEmail(
      admin.email,
      "Account Deleted",
      `Your admin account (${admin.email}) has been permanently deleted.`
    );

    res.status(200).json({ msg: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};



module.exports = {
  addadmin,
  login,
  checkAuth,
  getalladmins,
  logoutAdmin,
  blockAdmin,
  unblockAdmin,
  editAdmin,
  deleteAdmin
};