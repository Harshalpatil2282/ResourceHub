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

const sendVisitorMessage = async (data) => {
  const { visitorName, visitorEmail, visitorPhone, visitorSubject, visitorMessage, messageId } = data;
  
  try {
    const adminDashboardLink = `${process.env.CLIENT_URL}/admin/visitor-messages/${messageId}`;
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-bottom: 1px solid #ddd; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        .info-row { margin: 10px 0; }
        .info-label { font-weight: bold; color: #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📬 New Visitor Message</h2>
          <p>You have received a new message from a visitor.</p>
        </div>
        
        <div class="content">
          <div class="info-row">
            <span class="info-label">From:</span> ${visitorName}
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span> <a href="mailto:${visitorEmail}">${visitorEmail}</a>
          </div>
          ${visitorPhone ? `<div class="info-row"><span class="info-label">Phone:</span> ${visitorPhone}</div>` : ''}
          <div class="info-row">
            <span class="info-label">Subject:</span> ${visitorSubject}
          </div>
          
          <div class="message-box">
            <strong>Message:</strong>
            <p>${visitorMessage.replace(/\n/g, '<br>')}</p>
          </div>
          
          <a href="${adminDashboardLink}" class="button">View & Reply in Dashboard</a>
        </div>
        
        <div class="footer">
          <p>© 2024 ResourceHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Message: ${visitorSubject}`,
      html: htmlContent
    });
  } catch (err) {
    console.error('Error sending visitor message email:', err);
    throw new Error('Failed to send visitor message email');
  }
};

const sendVisitorReply = async (data) => {
  const { visitorEmail, visitorName, replyMessage } = data;
  
  try {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-bottom: 1px solid #ddd; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✉️ We Received Your Message</h2>
          <p>Thank you for contacting ResourceHub!</p>
        </div>
        
        <div class="content">
          <p>Hi ${visitorName},</p>
          
          <div class="message-box">
            <p>${replyMessage.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>If you have any further questions, feel free to reach out to us again.</p>
          <p>Best regards,<br><strong>ResourceHub Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2024 ResourceHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: visitorEmail,
      subject: 'Re: Your ResourceHub Message',
      html: htmlContent
    });
  } catch (err) {
    console.error('Error sending reply email:', err);
    throw new Error('Failed to send reply email');
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendVisitorMessage,
  sendVisitorReply
};
