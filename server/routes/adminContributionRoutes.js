const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const File = require('../models/File');
const {verifyToken,checkRole} = require('../middleware/auth');
const { v2: cloudinary } = require('cloudinary');

// Get all pending contributions
    router.get('/pending', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const pendingContributions = await Contribution.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('university', 'name')
      .populate('program', 'name')
      .populate('folder', 'name')
      .populate('subfolder', 'name');

    res.json(pendingContributions);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching contributions' });
  }
});

// Approve contribution
// Approve a contribution: create a File, then remove contribution
router.post('/approve/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id)
      .populate('user university program folder subfolder');

    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found.' });
    }

    // Create new File document
    const newFile = new File({
      name: contribution.title,
      description: contribution.description || '',
      url: contribution.fileUrl,
      uploadedBy: contribution.user._id,
      university: contribution.university._id,
      program: contribution.program._id,
      folder: contribution.folder._id,
      subfolder: contribution.subfolder ? contribution.subfolder._id : undefined,
      canDownload: true // or allow admin to decide dynamically
    });

    await newFile.save();

    // Remove the contribution after successful file save
    await contribution.remove();

    res.json({ message: 'Contribution approved and file added.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while approving contribution.' });
  }
});


// Reject contribution
router.post('/reject/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    contribution.status = 'rejected';
    contribution.adminNotes = adminNotes || '';
    await contribution.save();

    res.json({ msg: 'Contribution rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Server error while rejecting contribution' });
  }
});

// Delete contribution (optional cleanup endpoint)
router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    // Delete file from Cloudinary
    await cloudinary.uploader.destroy(contribution.cloudinaryPublicId);

    // Remove contribution document
    await contribution.deleteOne();

    res.json({ msg: 'Contribution deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting contribution' });
  }
});

module.exports = router;
