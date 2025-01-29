const jwt =require("jsonwebtoken")

import jwt from "jsonwebtoken";
import admin from "../models/admin.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JwT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const admin = await admin.findById(decoded.userId);
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.log("error from protectRoute", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
