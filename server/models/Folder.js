const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  university: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'University',
  required: true,
}
,
  parentFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);