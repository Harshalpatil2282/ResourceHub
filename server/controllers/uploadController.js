// server/controllers/uploadController.js
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const File = require('../models/File');
const Program = require('../models/Program');
const University = require('../models/University');
const Folder = require('../models/Folder');
const Activity = require('../models/Activity');

exports.uploadFile = async (req, res) => {
  try {
    const { folderId, canDownload = true } = req.body;

    if (!folderId) {
      return res.status(400).json({ msg: "Folder ID is required." });
    }

    const folder = await Folder.findById(folderId).populate('program').populate('university');
    if (!folder) {
      return res.status(404).json({ msg: "Folder not found." });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded." });
    }

    // Determine correct resource type for Cloudinary
    const fileType = req.file.mimetype;
    const isDoc = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ].includes(fileType);

    const resourceType = isDoc ? 'raw' : 'image';

    // Upload using stream
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `university_resource_hub/${folder.university.name}/${folder.program.name}/${folder.name}`,
            resource_type: "raw",
            access_mode: "public",
            chunk_size: 6000000,
            timeout: 600000
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);

    const fileUrl = result.secure_url; // Cloudinary handles proper URL generation

    const file = new File({
      name: req.file.originalname,
      type: req.file.mimetype,
      url: fileUrl,
      cloudinaryPublicId: result.public_id,
      folderId: folder._id,
      university: folder.university._id,
      canDownload,
      uploadedBy: req.user.userId
    });

    await file.save();

    // Optional: log upload activity
    await Activity.create({
      userId: req.user.userId,
      fileId: file._id,
      action: 'upload'
    });

    res.status(201).json({ msg: "✅ File uploaded successfully.", file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "❌ Failed to upload file.", error: err.message });
  }
};exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found." });

    // Defensive check
    if (file.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(file.cloudinaryPublicId, {
        resource_type: "raw", // or "image" if images
      });
    } else {
      console.warn("⚠️ cloudinaryPublicId missing, skipping Cloudinary deletion.");
    }

    await File.findByIdAndDelete(fileId);

    res.json({ msg: "✅ File deleted successfully." });
  } catch (err) {
    console.error("File deletion error:", err);
    res.status(500).json({ msg: "❌ Failed to delete file.", error: err.message });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const { name, canDownload } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ msg: "File not found." });
    }

    if (name) file.name = name;
    if (typeof canDownload === 'boolean') file.canDownload = canDownload;

    await file.save();

    res.json({ msg: "✅ File updated successfully.", file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "❌ Failed to update file.", error: err.message });
  }
};