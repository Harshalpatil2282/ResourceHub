// const express = require('express');
// const { createProgram, getProgramsByUniversity } = require('../controllers/programController');
// const { verifyToken, checkRole } = require('../middleware/auth');

// const router = express.Router();

// router.post('/', verifyToken, checkRole(['admin']), createProgram);
// router.get('/:universityId', verifyToken,checkRole(['admin','user']), getProgramsByUniversity);

// module.exports = router;
const express = require('express');
const router = express.Router();
const Program = require('../models/Program');

// GET all programs
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get programs' });
  }
});

module.exports = router;
