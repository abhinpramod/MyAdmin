const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = async (adminId, res) => {
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwta", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};

module.exports = generateToken;
