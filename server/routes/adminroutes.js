const express= require('express')
const router = express.Router();
const  {
  addadmin,
  login,
  checkAuth,
  getalladmins,
  deleteadmin,
  logoutAdmin
} =require( "../controllers/admincontrol")

const { protectRoute } = require("../middleware/authmiddleware");

// router.put("/manage-admin", manageadmin);
router.post("/addadmin", addadmin);
router.post("/login", login);
router.get("/check", protectRoute, checkAuth);
router.get("/get-all-admins", protectRoute, getalladmins);
router.delete("/delete-admin/:adminId", protectRoute, deleteadmin);
router.post("/logout",logoutAdmin)



module.exports = router;
