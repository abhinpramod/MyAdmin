const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "superadmin"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Admin", AdminSchema);
