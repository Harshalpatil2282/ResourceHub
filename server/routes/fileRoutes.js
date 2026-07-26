// server/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/multer');

const {
  getFilesByUser,
  getFilesByFolder,
  searchFilesByUser
} = require('../controllers/fileController');

const {uploadFile} = require('../controllers/uploadController');
const { verifyToken , checkRole } = require('../middleware/auth');
router.post('/upload', verifyToken, checkRole(['admin']), upload.single('file'), uploadFile);
router.get('/user', verifyToken, checkRole(['user', 'guest']), getFilesByUser);
router.get('/folder/:folderId', verifyToken, checkRole(['admin', 'user', 'guest']), getFilesByFolder);
router.get('/search', verifyToken, checkRole(['user', 'guest']), searchFilesByUser);
router.delete('/:id', verifyToken, checkRole(['admin']), uploadController.deleteFile);
router.put('/:id', verifyToken, checkRole(['admin']), uploadController.updateFile);



module.exports = router;
