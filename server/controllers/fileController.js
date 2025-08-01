const User = require('../models/User');
const File = require('../models/File');
const mongoose = require('mongoose');
// 🔒 Get files for user by folder + university
exports.getFilesByUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.university) {
      return res.status(403).json({ msg: 'Unauthorized or missing university' });
    }

    const { folderId, search = '' } = req.query;

    const query = {
      university: user.university,
      name: { $regex: search, $options: 'i' },
    };

    if (folderId && mongoose.Types.ObjectId.isValid(folderId)) {
      query.folderId = folderId;
    }

    const files = await File.find(query);
    res.json(files);
  } catch (err) {
    console.error('Error in getFilesByUser:', err);
    res.status(500).json({ msg: 'Error fetching files', error: err.message });
  }
};
exports.getFilesByFolder = async (req, res) => {
  try {
    const files = await File.find({ folderId: req.params.folderId })
      .populate('university', 'name')
      .populate({
        path: 'folderId',
        populate: { path: 'program', select: 'name' }
      });
    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch files.', error: err.message });
  }
};
exports.searchFilesByUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { search = '' } = req.query;

    const files = await File.find({
      university: user.university,
      name: { $regex: search, $options: 'i' }, // case-insensitive match
    });

    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: 'Error searching files', error: err.message });
  }
};
