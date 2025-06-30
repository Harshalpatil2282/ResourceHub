// server/routes/folderRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  createFolder,
  getFoldersByProgram,
  getSubfolders,
  getFoldersByUser,
  getAllFolders,getAllFoldersDetailed
} = require('../controllers/folderController');
const Program = require('../models/Program');

// Get all programs under a university
router.get('/university/:universityId', async (req, res) => {
  try {
    const programs = await Program.find({ university: req.params.universityId });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch programs.', error: err.message });
  }
});
// Admin creates folder or subfolder
router.post('/', verifyToken, checkRole(['admin']), createFolder);

// Get all root folders (semesters) under a program
router.get('/program/:programId', verifyToken, checkRole(['admin', 'user']), getFoldersByProgram);

// Get subfolders under a specific folder
router.get('/subfolders/:parentFolderId', verifyToken, checkRole(['admin', 'user']), getSubfolders);
router.get('/user', verifyToken, checkRole(['user']), getFoldersByUser);
router.get('/all', verifyToken, checkRole(['admin']), getAllFolders);
router.get('/detailed', verifyToken, checkRole(['admin']), getAllFoldersDetailed);

module.exports = router;
