const express= require('express')
const router = express.Router();
const  {
  addadmin,
  login,
  checkAuth,
  getalladmins,
  logoutAdmin,
  blockAdmin,
  unblockAdmin,
  editAdmin,
  deleteAdmin
} =require( "../controllers/admincontrol")

const { protectRoute } = require("../middleware/authmiddleware");

// router.put("/manage-admin", manageadmin);
router.post("/addadmin", addadmin);
router.post("/login", login);
router.get("/check", protectRoute, checkAuth);
router.get("/get-all-admins", protectRoute, getalladmins);
router.post("/logout",logoutAdmin)
router.patch("/block-admin/:adminId", blockAdmin);
router.patch("/unblock-admin/:adminId", unblockAdmin);
router.patch('/edit-admin/:adminId',protectRoute,editAdmin)
router,delete('/delete-admin/:adminId',protectRoute,deleteAdmin)

module.exports = router;
