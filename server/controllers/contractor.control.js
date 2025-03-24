const contractor = require("../model/contractor.js");
const sendEmail = require("../lib/mailer.js");

const requeststepone = async (req, res) => {
  try {
    console.log("requeststepone");

    const data = await contractor.find(
      { registrationStep: 1 , approvalStatus: "Pending" }
    );
    res.status(200).json(data);
  } catch (error) {
    console.log("error from requeststepone", error.message);
    res.status(500).json({ msg: error.message });
  }
};

const requeststeptwo = async (req, res) => {
  // const id="67af1799edfae8503a16185d"
  try {
    console.log("requeststeptwo");
    const data = await contractor.find(
      {
        registrationStep: 2,
        approvalStatus: 'Pending',
        verified: false
      }
    );
  console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log("error from requeststeptwo", error.message);
    res.status(500).json({ msg: error.message });
  }
}
const requestreject1st = async (req, res) => {
  try {
    console.log("requestreject");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, {
      approvalStatus: "Rejected",
    });
    console.log(data);
    const contractorName = data.contractorName;
    const email = data.email;
    const subject = "Application rejected";
    const text = `Hello ${contractorName},\n\nYour application has been rejected.\n\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);
    console.log("Email sent:", email, subject, text);

    res.status(200).json(data);
  } catch (error) {
    console.log("error from requestreject :", error.message);
    res.status(500).json({ msg: error.message });
  }
};

const requestapprove1st = async (req, res) => {
  try {
    console.log("requestapprove");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, {
      approvalStatus: "Approved",
    });
    const contractorName = data.contractorName;
    const email = data.email;
    const subject = "Application approved";
    const text = `Hello ${contractorName},\n\nYour application has been approved.\n\n your passed first step of the registration process. and you  can now login to your account and complete the document verification process. Once you have completed the document verification, you will be able to complete the registration process and you can start working as a contractor.\n\n If you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);
    console.log("Email sent:", email, subject, text);
    res.status(200).json(data);
  } catch (error) {
    console.log("error from requestapprove :", error.message);
    res.status(500).json({ msg: error.message });
  }
};
const allcontractors = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 5, 
      search = '', 
      status, 
      employeeRange,
      startDate,
      endDate
    } = req.query;

    const skip = (page - 1) * limit;
    
    let query = { verified: true };

    // Search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { companyName: searchRegex },
        { contractorName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { gstNumber: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { country: searchRegex }
      ];
    }

    // Status filter
    if (status) {
      query.isBlocked = status === 'blocked';
    }

    // Employee range filter
    if (employeeRange) {
      switch(employeeRange) {
        case '1-10':
          query.numberOfEmployees = { $gte: 1, $lte: 10 };
          break;
        case '10-20':
          query.numberOfEmployees = { $gt: 10, $lte: 20 };
          break;
        case '20-50':
          query.numberOfEmployees = { $gt: 20, $lte: 50 };
          break;
        case '50-100':
          query.numberOfEmployees = { $gt: 50, $lte: 100 };
          break;
        case '100+':
          query.numberOfEmployees = { $gt: 100 };
          break;
      }
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const total = await contractor.countDocuments(query);
    const data = await contractor.find(query)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error from AllContractors:", error.message);
    res.status(500).json({ 
      success: false,
      msg: error.message 
    });
  }
};

const blockcontractor = async (req, res) => {
  try {
    console.log("blockcontractor");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, { isBlocked: true });
    const contractorName = data.contractorName;
    const email = data.email;
    const subject = "Account blocked";
    const text = `Hello ${contractorName},\n\nYour account has been blocked.\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);
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
    const contractorName = data.contractorName;
    const email = data.email;
    const subject = "Account unblocked";
    const text = `Hello ${contractorName},\n\nYour account has been unblocked.\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);
    res.status(200).json(data);
  } catch (error) {
    console.log("error from unblockcontractor :", error.message);
    res.status(500).json({ msg: error.message });
  }
};
const requestapprove2nd = async (req, res) => {
  try {
    console.log("requestapprove2nd");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, {
      approvalStatus: "Approved",
      verified: true,
    });
    res.status(200).json(data);
    const contractorName = data.contractorName;
    const email = data.email;
    const subject = "dociment verified";
    const text = `Hello ${contractorName},\n\nYour account has been verified. your can now login to your account and start working as a contractor.\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);

  } catch (error) {
    console.log("error from requestapprove2nd :", error.message);
    res.status(500).json({ msg: error.message });
  }
};
const requestreject2nd = async (req, res) => {
  try {
    console.log("requestreject2nd");
    const { id } = req.params;
    const data = await contractor.findByIdAndUpdate(id, {
      approvalStatus: "Rejected",
    });
    res.status(200).json(data);
    const contractorName = data.contractorName;
    const email = data.email;
    const subject = " document verification rejected";
    const text = `Hello ${contractorName},\n\nYour account verification has been rejected.\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);
  } catch (error) {
    console.log("error from requestreject2nd :", error.message);
    res.status(500).json({ msg: error.message });
  }
}
module.exports = {
  requeststepone,
  requestreject1st,
  requestapprove1st,
  allcontractors,
  blockcontractor,
  unblockcontractor,
  requeststeptwo,
  requestreject2nd,
  requestapprove2nd
};
