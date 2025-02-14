const User = require("../model/user.js");

const allusers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    console.log("error from AllUsers :", error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  allusers,
};
