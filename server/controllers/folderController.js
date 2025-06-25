const Folder = require('../models/Folder');

exports.createFolder = async (req, res) => {
  const { name, programId, parentFolderId, universityId } = req.body;

  try {
    const folder = new Folder({
      name,
      programId,
      universityId, // Only include if your Folder model supports it
      parentFolderId: parentFolderId || null,
      createdBy: req.user ? req.user.userId : null // Only if req.user exists
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create folder', error: err.message });
  }
};

exports.getFoldersByProgram = async (req, res) => {
  const { programId } = req.params;
  const filter = { programId, parentFolderId: null };
  if (req.user.role === 'user') {
    filter.universityId = req.user.university;
  }
  const folders = await Folder.find(filter);
  res.json(folders);
};

exports.getSubfolders = async (req, res) => {
  const { parentFolderId } = req.params;

  try {
    const folders = await Folder.find({ parentFolderId });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get subfolders' });
  }
};
