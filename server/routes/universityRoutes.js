const express = require('express');
const { createUniversity, getUniversities } = require('../controllers/universityController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, checkRole(['admin']), createUniversity);
router.get('/', verifyToken,checkRole(['admin','user']), getUniversities); // accessible to all logged in users

module.exports = router;
