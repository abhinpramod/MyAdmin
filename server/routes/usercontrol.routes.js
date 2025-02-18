const express = require("express"); 
const router = express.Router();
const { allusers, toggleBlockStatus } = require("../controllers/user.control");
const { protectRoute } = require("../middleware/authmiddleware");

router.get("/get-all-users", protectRoute, allusers);
router.put("/block/:userId", protectRoute, toggleBlockStatus);

module.exports = router;