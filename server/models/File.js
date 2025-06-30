// server/models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  type: String, // pdf, docx, ppt, image
  url: String, // Cloudinary or S3 URL
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  canDownload: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  cloudinaryPublicId: {
  type: String,
  required: true,
  }
  
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
