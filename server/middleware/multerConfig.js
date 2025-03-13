const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../lib/cloudinary"); // Import Cloudinary config

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "jobtypes", // Cloudinary folder name
    format: async (req, file) => "png", // Or dynamically use file.mimetype.split("/")[1]
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Multer Middleware
const upload = multer({ storage });

module.exports = upload;
