const jwt = require("jsonwebtoken");

const Admin = require("../model/admin");
const env = require("dotenv").config();

const protectRoute = async (req, res, next) => {
  console.log('protectRoute');
  
  try {
    const token = req.cookies.jwta;

    if (!token) {
      return res.status(401).json({ msg: " No token found Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    
    const admin = await Admin.findById(decoded.adminId);
    if (admin?.isBlocked) {
    return res.status(401).json({ msg: "your account is blocked conect with superadmin" });
    
    }
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.log("error from protectRoute", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { protectRoute };
