// const express = require('express');
// const router = express.Router();
// const { getAllLogs } = require('../controllers/activityController');
// const { verifyToken, checkRole } = require('../middleware/auth');

// router.get('/', verifyToken, checkRole(['admin']), getAllLogs);

// module.exports = router;
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// GET all logs
router.get('/', async (req, res) => {
  try {
    const logs = await Activity.find()
      .populate('userId', 'name email')
      .populate('fileId', 'name')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get logs' });
  }
});

module.exports = router;
