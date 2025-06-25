const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  createFolder,
  getFoldersByProgram,
  getSubfolders
} = require('../controllers/folderController');

// Admin creates folder or subfolder
router.post('/', verifyToken, checkRole(['admin']), createFolder);

// Get all root folders (semesters) of a program
router.get('/program/:programId', verifyToken, getFoldersByProgram);

// Get subfolders of a specific folder (subjects inside semester)
router.get('/subfolders/:parentFolderId', verifyToken, getSubfolders);

module.exports = router;
