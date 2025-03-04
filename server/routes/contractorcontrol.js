const express = require("express");
const router = express.Router();
const {
  requeststepone,
  requeststeptwo,
  // requestdocuments
  requestreject1st,
  requestapprove1st,
  allcontractors,
  blockcontractor,
  unblockcontractor,
  requestreject2nd,
  requestapprove2nd
} = require("../controllers/contractor.control");
// const { blockAdmin } = require('../controllers/admincontrol');
const { protectRoute } = require("../middleware/authmiddleware");

router.get("/get-all-contractors",protectRoute, allcontractors);
router.get("/requests/step-one", protectRoute, requeststepone);
router.get("/requests/step-two", protectRoute, requeststeptwo);
router.patch("/requests/step-one/reject/:id", protectRoute, requestreject1st);
router.patch("/requests/step-one/approve/:id", protectRoute, requestapprove1st);
router.patch("/requests/step-two/reject/:id", protectRoute, requestreject2nd);
router.patch("/requests/step-two/approve/:id", protectRoute, requestapprove2nd);

router.put("/block/:id", protectRoute, blockcontractor);
router.put("/unblock/:id", protectRoute, unblockcontractor);

module.exports = router;
