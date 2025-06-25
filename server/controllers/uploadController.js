// server/controllers/uploadController.js
const cloudinary = require('../config/cloudinary');
const File = require('../models/File');
const Activity = require('../models/Activity');
// const AdmZip = require('adm-zip');
// const streamifier = require('streamifier');

exports.uploadFile = async (req, res) => {
  const { folderId, canDownload } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ msg: "No file uploaded" });

  try {
    const uploadResult = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "university_files" },
      async (error, result) => {
        if (error) return res.status(500).json({ msg: "Cloudinary Error", error });

        const newFile = new File({
          name: file.originalname,
          type: file.mimetype,
          url: result.secure_url,
          folderId,
          canDownload: canDownload === 'true',
          uploadedBy: req.user.userId
        });

        await newFile.save();
        res.status(201).json(newFile);
      }
    );

    uploadResult.end(file.buffer);
  } catch (err) {
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};
// exports.getFilesByFolder = async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const files = await File.find({ folderId });
//     res.json(files);
//   } catch (err) {
//     res.status(500).json({ msg: "Error getting files" });
//   }
// };
exports.searchFiles = async (req, res) => {
  try {
    const { name, folderId } = req.query;

    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' }; // case-insensitive
    if (folderId) query.folderId = folderId;

    const results = await File.find(query).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: "Search error", error: err.message });
  }
};


// exports.uploadZip = async (req, res) => {
//   const { folderId, canDownload } = req.body;
//   const zipFile = req.file;

//   if (!zipFile || zipFile.mimetype !== 'application/zip') {
//     return res.status(400).json({ msg: "Only ZIP files allowed" });
//   }

//   try {
//     const zip = new AdmZip(zipFile.buffer);
//     const zipEntries = zip.getEntries();
//     const uploadedFiles = [];

//     for (const entry of zipEntries) {
//       if (entry.isDirectory) continue;

//       const buffer = entry.getData();
//       const ext = entry.name.split('.').pop().toLowerCase();
//       const mimeType = getMimeType(ext);

//       if (!mimeType) continue; // skip unsupported files

//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { resource_type: "auto", folder: "university_files" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         streamifier.createReadStream(buffer).pipe(stream);
//       });

//       const newFile = new File({
//         name: entry.entryName,
//         type: mimeType,
//         url: uploadResult.secure_url,
//         folderId,
//         canDownload: canDownload === 'true',
//         uploadedBy: req.user.userId,
//       });

//       await newFile.save();
//       uploadedFiles.push(newFile);
//     }

//     res.status(201).json({
//       msg: `✅ ${uploadedFiles.length} files uploaded successfully!`,
//       files: uploadedFiles,
//     });

//   } catch (err) {
//     console.error("ZIP Upload Error:", err);
//     res.status(500).json({ msg: "Error processing ZIP file", error: err.message });
//   }
// };
// await new Activity({
//   userId: req.user.userId,
//   fileId: newFile._id,
//   action: 'upload'
// }).save();
// // Helper function to get mimetype
// function getMimeType(ext) {
//   const types = {
//     pdf: 'application/pdf',
//     ppt: 'application/vnd.ms-powerpoint',
//     pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     doc: 'application/msword',
//     docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     png: 'image/png',
//     jpg: 'image/jpeg',
//     jpeg: 'image/jpeg',
//   };
//   return types[ext];
// }
// exports.trackDownload = async (req, res) => {
//   try {
//     const { fileId } = req.params;
//     const file = await File.findById(fileId);
//     if (!file) return res.status(404).json({ msg: 'File not found' });

//     await new Activity({
//       userId: req.user.userId,
//       fileId,
//       action: 'download'
//     }).save();

//     res.json({ url: file.url });
//   } catch (err) {
//     res.status(500).json({ msg: 'Tracking error', error: err.message });
//   }
// };

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });

    await file.deleteOne();
    res.json({ msg: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateFile = async (req, res) => {
  const { name, canDownload } = req.body;
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });

    if (name) file.name = name;
    if (typeof canDownload === 'boolean') file.canDownload = canDownload;

    await file.save();
    res.json({ msg: 'File updated', file });
  } catch (err) {
    res.status(500).json({ msg: 'Update error', error: err.message });
  }
};
