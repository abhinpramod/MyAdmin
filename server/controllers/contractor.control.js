const contractor = require("../model/contractor.js");

const requeststepone = async (req, res) => {
  try {
    console.log("requeststepone");

    const data = await contractor.find(
      { registrationStep: 1 } && { approvalStatus: "Pending" }
    );
    res.status(200).json(data);
  } catch (error) {
    console.log("error from requeststepone", error.message);
    res.status(500).json({ msg: error.message });
  }
};
const requestreject = async (req, res) => {
  try {
    console.log("requestreject");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, {
      approvalStatus: "Rejected",
    });
    res.status(200).json(data);
  } catch (error) {
    console.log("error from requestreject :", error.message);
    res.status(500).json({ msg: error.message });
  }
};

const requestapprove = async (req, res) => {
  try {
    console.log("requestapprove");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, {
      approvalStatus: "Approved",
    });
    res.status(200).json(data);
  } catch (error) {
    console.log("error from requestapprove :", error.message);
    res.status(500).json({ msg: error.message });
  }
};
const allcontractors = async (req, res) => {
  try {
    console.log("AllContractors");
    const data = await contractor.find({ approvalStatus: "Approved" });
    res.status(200).json(data);
  } catch (error) {
    console.log("error from AllContractors :", error.message);
    res.status(500).json({ msg: error.message });
  }
};

const blockcontractor = async (req, res) => {
  try {
    console.log("blockcontractor");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, { isBlocked: true });
    res.status(200).json(data);
  } catch (error) {
    console.log("error from blockcontractor :", error.message);
    res.status(500).json({ msg: error.message });
  }
};

const unblockcontractor = async (req, res) => {
  try {
    console.log("unblockcontractor");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, { isBlocked: false });
    res.status(200).json(data);
  } catch (error) {
    console.log("error from unblockcontractor :", error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  requeststepone,
  requestreject,
  requestapprove,
  allcontractors,
  blockcontractor,
  unblockcontractor,
};
