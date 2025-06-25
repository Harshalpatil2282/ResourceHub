const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  },
  action: {
    type: String,
    enum: ['upload', 'download'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
