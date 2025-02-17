const express = require("express"); 
const router = express.Router();
const { allusers, toggleBlockStatus } = require("../controllers/user.control");

router.get("/get-all-users", allusers);
router.put("/block/:userId", toggleBlockStatus);

module.exports = router;