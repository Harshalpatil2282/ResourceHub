const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../config/email'); // correct path

// 📌 Register a new user with email verification
exports.register = async (req, res) => {
  const { name, email, password, university, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      email,
      password,
      university,
      role: role || 'user',
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    await user.save();

    // Attempt to send verification email — non-blocking (user is still created)
    let emailSent = true;
    try {
      const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
      await sendVerificationEmail(user.email, verificationLink);
    } catch (emailErr) {
      console.error("Verification email failed:", emailErr.message);
      emailSent = false;
    }

    return res.status(201).json({
      msg: emailSent
        ? 'User registered. Please check your email to verify your account.'
        : 'User registered, but the verification email could not be sent. Please contact support.',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        university: user.university
      }
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 📌 Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;
 

  try {
    const user = await User.findOne({ email }).populate('university');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ msg: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 📌 Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'No account found with that email address' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Attempt to send reset email — if it fails, return a clear error
    try {
      const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
      await sendResetPasswordEmail(user.email, resetLink);
      res.json({ msg: 'Password reset link sent to your email. Please check your inbox.' });
    } catch (emailErr) {
      console.error("Reset email failed:", emailErr.message);
      res.status(500).json({
        msg: 'Could not send reset email. Please try again later or contact support.'
      });
    }
  } catch (err) {
    console.error("Error in forgot password route:", err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// 📌 Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Token invalid or expired' });
    }

    user.password = newPassword; // pre-save hook hashes automatically
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// 📌 Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Token invalid or expired" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Verify Email Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
