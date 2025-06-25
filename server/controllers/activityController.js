const Activity = require('../models/Activity');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Activity.find()
      .populate('userId', 'name email')
      .populate('fileId', 'name')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get logs' });
  }
};
