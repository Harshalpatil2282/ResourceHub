// server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {transporter,sendVerificationEmail} = require('../config/email'); // adjust based on your project


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

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendVerificationEmail(user.email, verificationLink);

    return res.status(201).json({
      msg: 'User registered. Verification email sent.',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        university: user.university
      }
      // Do not return token until email is verified
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

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   console.log('Login request for:', email);
//   try {
//     const user = await User.findOne({ email }).populate('university');
//     console.log('Found user:', user && { email: user.email, isVerified: user.isVerified });
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     if (!user.isVerified) {
//       console.log('Login blocked: email not verified');
//       return res.status(401).json({ msg: 'Please verify your email before logging in' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log('Password match?', isMatch);
//     if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, university: user.university } });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };



exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ msg: 'Token invalid or expired' });

  user.password = newPassword; // ensure pre-save hash
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save();

  res.json({ msg: 'Password reset successfully' });
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });

  res.json({ msg: 'Password reset link sent to your email' });
};


exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      // Check if the user is already verified
      const userByToken = await User.findOne({
        isVerified: true
      });
      if (userByToken) {
        return res.json({ msg: "Email already verified. You can now log in." });
      }

      return res.status(400).json({ msg: "Token invalid or expired" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Verify Email Error :", err);
    res.status(500).json({ msg: "Server error" });
  }
};
