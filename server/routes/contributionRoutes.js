// server/routes/contributionRoutes.js

const express = require('express');
const router = express.Router();
const {
  createContribution,
  getPendingContributions,
  acceptContribution,
  rejectContribution,
  getAcceptedContributions,
  getRejectedContributions
} = require('../controllers/contributionController');

const { verifyToken, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure tmpUploads directory exists
const tmpDir = path.join(__dirname, '../tmpUploads');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

// Multer setup for temporary local uploads before Cloudinary
const upload = multer({
  dest: tmpDir,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

// =============================
// 📌 User Routes (Submit Contribution)
// =============================

router.post(
  '/',
  verifyToken,
  checkRole(['user']),
  createContribution
);

// =============================
// 📌 Admin Routes
// =============================

// Get pending contributions for admin review
router.get(
  '/admin',
  verifyToken,
  checkRole(['admin']),
  getPendingContributions
);

// Accept contribution, upload to Cloudinary, insert into Files
router.post(
  '/:id/accept',
  verifyToken,
  checkRole(['admin']),
  upload.single('file'), // Multer handles the file
  acceptContribution
);

// Reject contribution
router.post(
  '/:id/reject',
  verifyToken,
  checkRole(['admin']),
  rejectContribution
);

// View accepted contributions
router.get(
  '/admin/accepted',
  verifyToken,
  checkRole(['admin']),
  getAcceptedContributions
);

// View rejected contributions
router.get(
  '/admin/rejected',
  verifyToken,
  checkRole(['admin']),
  getRejectedContributions
);

module.exports = router;
