const express = require("express"); 
const router = express.Router();
const { allusers } = require("../controllers/user.control");

router.get("/get-all-users", allusers);

module.exports = router;