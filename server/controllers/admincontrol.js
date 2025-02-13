const  Admin = require ("../model/admin.js");
const bcrypt = require("bcrypt");
const   generateToken =require ("../lib/utils.js" )
const sendEmail =require ("../lib/mailer.js" )

const addadmin = async (req, res) => {
  const { email, password, fullname, role ,uniqueId} = req.body;
  console.log(req.body);  
  

  try {
      if (!fullname || !email || !password ) {
          return res.status(400).json({ message: "All fields are required man" });
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
          uniqueId: uniqueId
      });

      await newadmin.save(); // Save the admin
      const subject = 'Welcome to Our Application';
      const text = `Hello ${fullname},\n\nYou have been added as an admin to our application.\n\nPlease use the following credentials to log in:\n\nEmail: ${email}\nPassword: ${password}\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;
  
      sendEmail(email, subject, text);
      console.log("Email sent:", email, subject, text);

      return res.status(201).json({
          _id: newadmin._id,
          fullname: newadmin.fullname,
          email: newadmin.email,
          role: newadmin.role,
          uniqueId: newadmin.uniqueId
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

  if (admin.isBlocked) return res.status(403).json({ msg: "Admin is blocked" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

  generateToken(admin._id, res);
  res.status(200).json({
    
    _id: admin._id,
    fullname: admin.fullname,
    email: admin.email,
    role: admin.role,
    uniqueId: admin.uniqueId
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
        uniqueId: req.admin.uniqueId
      });
    } catch (error) {
      console.log("error from checkAuth", error.message);
      res.status(500).json({ msg: error.message }); 
    }
  };

// Get all admins
const getalladmins = async (req, res) => {  
  try {
    const admins = await Admin.find({role: {$ne: "superadmin"}});
    res.status(200).json(admins);
  } catch (error) {
    console.log("error from getalladmins", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// Delete an admin by ID
const blockAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    admin.isBlocked = true;
    await admin.save();

    res.status(200).json({ msg: "Admin blocked successfully" });
  } catch (error) {
    console.error("Error blocking admin:", error.message);
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

    res.json({ msg: "Admin unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking admin:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const logoutAdmin = async  (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ msg: "Logout success" });
  } catch (error) {
    console.log("error from logout", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Export the functions using CommonJS
module.exports = { addadmin,login,checkAuth,getalladmins,logoutAdmin,blockAdmin,unblockAdmin };
