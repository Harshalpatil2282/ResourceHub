const express = require('express');
const router = express.Router();
const { login, register,forgotPassword,resetPassword } = require('../controllers/authController');

const { verifyEmail } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);

router.get('/verify-email/:token', verifyEmail);


router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
