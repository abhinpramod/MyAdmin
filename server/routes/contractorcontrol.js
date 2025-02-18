const express = require("express");
const router = express.Router();
const {
  requeststepone,
  // requestdocuments
  requestreject,
  requestapprove,
  allcontractors,
  blockcontractor,
  unblockcontractor,
} = require("../controllers/contractor.control");
// const { blockAdmin } = require('../controllers/admincontrol');
const { protectRoute } = require("../middleware/authmiddleware");

router.get("/get-all-contractors",protectRoute, allcontractors);
router.get("/requests/step-one", protectRoute, requeststepone);
router.patch("/requests/reject/:id", protectRoute, requestreject);
router.patch("/requests/approve/:id", protectRoute, requestapprove);

router.put("/block/:id", protectRoute, blockcontractor);
router.put("/unblock/:id", protectRoute, unblockcontractor);

module.exports = router;
