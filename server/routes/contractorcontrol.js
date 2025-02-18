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
} = require("../middleware/contractor.control");
// const { blockAdmin } = require('../controllers/admincontrol');

router.get("/get-all-contractors", allcontractors);
router.get("/requests/step-one", requeststepone);
router.patch("/requests/reject/:id", requestreject);
router.patch("/requests/approve/:id", requestapprove);

router.put("/block/:id", blockcontractor);
router.put("/unblock/:id", unblockcontractor);

module.exports = router;
