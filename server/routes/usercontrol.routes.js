const express = require("express");
const router = express.Router();
const { 
  allusers, 
  toggleBlockStatus,
  createUser,
  updateUser
} = require("../controllers/user.control");
const { protectRoute } = require("../middleware/authmiddleware");

// Protected routes (require authentication)
router.get("/get-all-users", protectRoute, allusers);
router.put("/block/:userId", protectRoute, toggleBlockStatus);
router.post("/create", protectRoute, createUser);
router.put("/update/:userId", protectRoute, updateUser);

module.exports = router;