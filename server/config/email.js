// server/utils/email.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


const sendVerificationEmail = async (to, link) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Verify your ResourceHub account',
      html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
    });
  } catch (err) {
    console.error('Error sending verification email:', err);
    throw new Error('Failed to send verification email');
  }
};

const sendResetPasswordEmail = async (to, link) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Reset your ResourceHub password',
      html: `<p>Click <a href="${link}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    });
  } catch (err) {
    console.error('Error sending reset password email:', err);
    throw new Error('Failed to send reset password email');
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail
};
