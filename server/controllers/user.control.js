const User = require("../model/user.js");
const sendEmail = require("../lib/mailer.js");

const allusers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    console.log("error from AllUsers :", error.message);
    res.status(500).json({ msg: error.message });
  }
};

const toggleBlockStatus = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from the URL
    const { isBlocked } = req.body; // Extract isBlocked from request body

    // Find the user by ID and update isBlocked status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true } // Returns the updated user
    );
    const userName = updatedUser.fullname;
    const email = updatedUser.email;
    const subject = `Account ${isBlocked ? "blocked" : "unblocked"}`;
    const text = `Hello ${userName},\n\nYour account has been ${
      isBlocked ? "blocked" : "unblocked"
    }.\n\nIf you have any questions, please contact our support team.\n\nThank you,\nOur Team`;

    sendEmail(email, subject, text);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user block status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  allusers,
  toggleBlockStatus,
};
