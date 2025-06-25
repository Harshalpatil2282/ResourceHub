const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/activityController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/', verifyToken, checkRole(['admin']), getAllLogs);

module.exports = router;
