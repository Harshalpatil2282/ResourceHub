const express = require('express');
const router = express.Router();
const { createProgram, getProgramsByUniversity } = require('../controllers/programController');

// POST to create a program
router.post('/', createProgram);

// GET programs by university ID
router.get('/university/:universityId', getProgramsByUniversity);

module.exports = router;
