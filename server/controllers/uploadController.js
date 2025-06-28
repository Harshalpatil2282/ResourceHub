// server/controllers/uploadController.js
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

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `university_resource_hub/${folder.university.name}/${folder.program.name}/${folder.name}`,
      resource_type: "auto"
    });

    const file = new File({
      name: req.file.originalname,
      type: req.file.mimetype,
      url: result.secure_url,
      folderId: folder._id,
      university: folder.university._id,
      canDownload,
      uploadedBy: req.user.userId
    });

    await file.save();
    res.status(201).json({ msg: "File uploaded successfully.", file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to upload file.", error: err.message });
  }
};

exports.searchFiles = async (req, res) => {
  try {
    const { name, folderId } = req.query;

    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' }; // case-insensitive
    if (folderId) query.folderId = folderId;

    const results = await File.find(query).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: "Search error", error: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });

    await file.deleteOne();
    res.json({ msg: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateFile = async (req, res) => {
  const { name, canDownload } = req.body;
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });

    if (name) file.name = name;
    if (typeof canDownload === 'boolean') file.canDownload = canDownload;

    await file.save();
    res.json({ msg: 'File updated', file });
  } catch (err) {
    res.status(500).json({ msg: 'Update error', error: err.message });
  }
};
// await Activity.create({
//   userId: req.user.userId,
//   fileId: file._id,
//   action: 'upload'
// });