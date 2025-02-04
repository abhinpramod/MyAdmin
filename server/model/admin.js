const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String,   },
  isBlocked: { type: Boolean, default: false }, // New field for blocking admins
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
