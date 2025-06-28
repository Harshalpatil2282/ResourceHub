const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  createFolder,
  getFoldersByProgram,
  getSubfolders,
  getFoldersByUser
} = require('../controllers/folderController');

// Admin creates folder or subfolder
router.post('/', verifyToken, checkRole(['admin']), createFolder);

// Get all root folders (semesters) of a program
router.get('/program/:programId', verifyToken,checkRole(['admin','user']), getFoldersByProgram);

// Get subfolders of a specific folder (subjects inside semester)
router.get('/subfolders/:parentFolderId', verifyToken,checkRole(['admin','user']), getSubfolders);


router.get('/user', verifyToken, checkRole(['user']), getFoldersByUser);

module.exports = router;
