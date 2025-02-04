// const  { generateToken }=require ("../lib/utils.js" )
const  Admin = require ("../model/admin.js");
const bcrypt = require("bcrypt");
const   generateToken =require ("../lib/utils.js" )

const addadmin = async (req, res) => {
    const { email, password, fullname, role } = req.body;
    console.log(req.body);
    

    try {
        if (!fullname || !email || !password || !role) {
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
        });

        await newadmin.save(); // Save the admin

        return res.status(201).json({
            _id: newadmin._id,
            fullname: newadmin.fullname,
            email: newadmin.email,
            role: newadmin.role
        });

    } catch (error) {
        console.log("Error from addadmin:", error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    
    let admin
  
    try {
       admin = await Admin.findOne({ email: String(email) });
      if (!admin) return res.status(400).json({ msg: "Invalid Email" });
      console.log('emailfinded');
      
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid password" });
  
      generateToken(admin._id, res);
      res.status(200).json({
        _id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role
      });
    } catch (error) {
      console.log("error from login :", error.message);
      res.status(500).json({ msg: "Internal server error" });
    }
  };

  const checkAuth = (req, res) => {
    try {
      res.status(200).json({
        _id: req.admin._id,
        fullname: req.admin.fullname,
        email: req.admin.email,
        role: req.admin.role
      });
    } catch (error) {
      console.log("error from checkAuth", error.message);
      res.status(500).json({ msg: error.message }); 
    }
  };

// Get all admins
const getalladmins = async (req, res) => {  
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    console.log("error from getalladmins", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// Delete an admin by ID
const deleteadmin = async (req, res) => {
  const { adminId } = req.params;
  try {
    const admin = await Admin.findById(adminId); // Use findById to find the admin
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    await Admin.findByIdAndDelete(adminId); // Use findByIdAndDelete to remove the admin
    res.json({ msg: "Admin deleted successfully" });
  } catch (error) {
    console.log("error from deleteadmin", error.message);
    res.status(500).json({ msg: "Error deleting admin", error: error.message });
  }
};

const logoutAdmin = async = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ msg: "Logout success" });
  } catch (error) {
    console.log("error from logout", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Export the functions using CommonJS
module.exports = { addadmin,login,checkAuth,getalladmins,deleteadmin,logoutAdmin };
