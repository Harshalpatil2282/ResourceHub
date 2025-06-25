// server/models/Program.js
const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);
