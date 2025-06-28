// const Folder = require('../models/Folder');
// const User = require('../models/User');

// exports.createFolder = async (req, res) => {
//   const { name, programId, parentFolderId, universityId } = req.body;

//   try {
//     const folder = new Folder({
//       name,
//       programId,
//       universityId, // Only include if your Folder model supports it
//       parentFolderId: parentFolderId || null,
//       createdBy: req.user ? req.user.userId : null // Only if req.user exists
//     });

//     await folder.save();
//     res.status(201).json(folder);
//   } catch (err) {
//     res.status(500).json({ msg: 'Failed to create folder', error: err.message });
//   }
// };

// exports.getFoldersByProgram = async (req, res) => {
//   const { programId } = req.params;
//   const filter = { programId, parentFolderId: null };
//   if (req.user.role === 'user') {
//     filter.universityId = req.user.university;
//   }
//   const folders = await Folder.find(filter);
//   res.json(folders);
// };

// exports.getSubfolders = async (req, res) => {
//   const { parentFolderId } = req.params;

//   try {
//     const folders = await Folder.find({ parentFolderId });
//     res.json(folders);
//   } catch (err) {
//     res.status(500).json({ msg: 'Failed to get subfolders' });
//   }
// };

// exports.getFoldersByUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user || !user.university) {
//       return res.status(403).json({ msg: 'Unauthorized or missing university' });
//     }

//     const parentId = req.query.parentId || null;

//     const folders = await Folder.find({
//       universityId: user.university,
//       parentFolderId: parentId,
//     });

//     res.json(folders);
//   } catch (err) {
//     res.status(500).json({ msg: 'Failed to get user folders', error: err.message });
//   }
// };
// server/controllers/folderController.js
const Folder = require('../models/Folder');
const User = require('../models/User');
const Program = require('../models/Program');
const University = require('../models/University');

exports.createFolder = async (req, res) => {
  try {
    const { name, universityId, programId, parentFolderId } = req.body;

    if (!name || !universityId || !programId) {
      return res.status(400).json({ msg: "Name, universityId, and programId are required." });
    }

    // Validate university
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ msg: "University not found." });
    }

    // Validate program and ensure it belongs to the selected university
    const program = await Program.findOne({ _id: programId, university: universityId });
    if (!program) {
      return res.status(404).json({ msg: "Program not found for the selected university." });
    }

    // If parentFolderId is provided, validate it
    let parentFolder = null;
    if (parentFolderId) {
      parentFolder = await Folder.findById(parentFolderId);
      if (!parentFolder) {
        return res.status(404).json({ msg: "Parent folder not found." });
      }
    }

    const folder = new Folder({
      name,
      university: universityId,
      program: programId,
      parentFolder: parentFolderId || null
    });

    await folder.save();
    res.status(201).json({ msg: "Folder created successfully.", folder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create folder.", error: err.message });
  }
};
// Get all root folders (semesters) of a program
exports.getFoldersByProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const folders = await Folder.find({
      program: programId,
      parentFolder: null
    });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get folders.", error: err.message });
  }
};

// Get subfolders under a parent folder
exports.getSubfolders = async (req, res) => {
  try {
    const { parentFolderId } = req.params;
    const folders = await Folder.find({ parentFolder: parentFolderId });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get subfolders.", error: err.message });
  }
};
