// server/controllers/contributionController.js

const Contribution = require('../models/Contribution');
const File = require('../models/File');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// POST /api/contributions
exports.createContribution = async (req, res) => {
  try {
    const { programId, folderId, subfolderId, fileName, fileType } = req.body;
    const userId = req.user.userId;

    // Fetch user to confirm university association
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const contribution = new Contribution({
      contributor: { name: user.name, email: user.email, userId: user._id },
      universityId: user.university, // enforce user’s own university
      programId,
      folderId,
      subfolderId,
      fileName,
      fileType,
      status: 'pending'
    });

    await contribution.save();
    res.status(201).json({ msg: "Contribution submitted for admin review." });

  } catch (err) {
    console.error("Create Contribution Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET /api/contributions/admin (pending)
exports.getPendingContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ status: 'pending' })
      .populate('universityId programId folderId subfolderId');
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching contributions", error: err.message });
  }
};

// POST /api/contributions/:id/accept
exports.acceptContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const contribution = await Contribution.findById(id)
      .populate('universityId programId folderId subfolderId');
    if (!contribution) return res.status(404).json({ msg: "Contribution not found" });

    // Upload to Cloudinary
    const file = req.file; // Ensure multer middleware used
    if (!file) return res.status(400).json({ msg: "No file uploaded" });

    const uploadPath = `ResourceHub/${contribution.universityId.name}/${contribution.programId.name}/${contribution.folderId.name}/${contribution.subfolderId.name}`;

    const result = await cloudinary.uploader.upload(file.path, {
      folder: uploadPath,
      resource_type: "auto"
    });

    // Create File entry
    const newFile = new File({
      fileName: contribution.fileName,
      fileType: contribution.fileType,
      cloudinaryUrl: result.secure_url,
      universityId: contribution.universityId._id,
      programId: contribution.programId._id,
      folderId: contribution.folderId._id,
      subfolderId: contribution.subfolderId._id,
      contributor: contribution.contributor
    });
    await newFile.save();

    // Update contribution status
    contribution.status = 'accepted';
    contribution.cloudinaryUrl = result.secure_url;
    contribution.reviewedAt = new Date();
    contribution.reviewerAdminId = req.user.userId;
    await contribution.save();

    res.json({ msg: "Contribution accepted and file uploaded successfully." });

  } catch (err) {
    console.error("Accept Contribution Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// POST /api/contributions/:id/reject
exports.rejectContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const contribution = await Contribution.findById(id);
    if (!contribution) return res.status(404).json({ msg: "Contribution not found" });

    contribution.status = 'rejected';
    contribution.rejectionReason = rejectionReason || "No reason provided";
    contribution.reviewedAt = new Date();
    contribution.reviewerAdminId = req.user.userId;
    await contribution.save();

    res.json({ msg: "Contribution rejected." });
  } catch (err) {
    console.error("Reject Contribution Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// GET /api/contributions/admin/accepted
exports.getAcceptedContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ status: 'accepted' })
      .populate('universityId programId folderId subfolderId');
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching accepted contributions", error: err.message });
  }
};

// GET /api/contributions/admin/rejected
exports.getRejectedContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ status: 'rejected' })
      .populate('universityId programId folderId subfolderId');
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching rejected contributions", error: err.message });
  }
};
