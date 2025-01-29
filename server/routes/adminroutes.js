const express= require('express')
const router = express.Router();
const  {
  addadmin,
  login
 
} =require( "../controllers/admincontrol")

// router.put("/manage-admin", manageadmin);
router.post("/addadmin", addadmin);
router.post("/login", login);



module.exports = router;
