const multer = require("multer");


// Cloudinary Storage Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
