const express = require('express');
const router = express.Router();
const { login, register, forgotPassword, resetPassword, guestLogin } = require('../controllers/authController');

const { verifyEmail } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/guest-login', guestLogin);

router.get('/verify-email/:token', verifyEmail);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
