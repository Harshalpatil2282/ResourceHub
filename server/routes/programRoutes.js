const express = require('express');
const { createProgram, getProgramsByUniversity } = require('../controllers/programController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, checkRole(['admin']), createProgram);
router.get('/:universityId', verifyToken, getProgramsByUniversity);

module.exports = router;
