const User = require('../models/User');
const File = require('../models/File');

// 🔒 Get files for user by folder + university
exports.getFilesByUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.university) {
      return res.status(403).json({ msg: 'User or university not found' });
    }

    const folderId = req.query.folderId || null;

    const files = await File.find({
      folderId,
      universityId: user.university,
    });

    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching files', error: err.message });
  }
};
exports.getFilesByUser = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const files = await File.find({
    universityId: user.university,
    folderId: req.query.folderId
  });
  res.json(files);
};

// 🗂️ (Optional) Admin: Get all files in folder (not filtered)
exports.getFilesByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const files = await File.find({ folderId });
    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: 'Error getting files' });
  }
};

exports.searchFilesByUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { search = '' } = req.query;

    const files = await File.find({
      universityId: user.university,
      name: { $regex: search, $options: 'i' }, // case-insensitive match
    });

    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: 'Error searching files', error: err.message });
  }
};
