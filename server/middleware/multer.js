// server/middleware/multer.js
const multer = require('multer');
const path = require('path');

// Accept specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|png|jpg|jpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  cb(null, extname);
};

const storage = multer.memoryStorage(); // keep it in RAM before Cloudinary

module.exports = multer({ storage, fileFilter });
