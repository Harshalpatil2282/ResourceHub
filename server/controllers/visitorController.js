const Visitor = require('../models/Visitor');
const { sendVisitorMessage } = require('../config/email');

// Send message from visitor
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get visitor IP address
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Create visitor message document
    const visitor = await Visitor.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      ipAddress
    });

    // Send email notification to admin
    try {
      await sendVisitorMessage({
        visitorName: name,
        visitorEmail: email,
        visitorPhone: phone,
        visitorSubject: subject,
        visitorMessage: message,
        messageId: visitor._id
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, but log it
    }

    // Send response to visitor
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: visitor._id,
        email: visitor.email
      }
    });

  } catch (error) {
    console.error('Error sending visitor message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again later.'
    });
  }
};

// Get all visitor messages (Admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Visitor.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
};

// Get single message
exports.getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Visitor.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read
    if (!message.read) {
      message.read = true;
      await message.save();
    }

    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching message'
    });
  }
};

// Reply to visitor message
exports.replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reply message'
      });
    }

    const message = await Visitor.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.replyMessage = replyMessage;
    message.replied = true;
    await message.save();

    // Send reply email to visitor
    try {
      await sendVisitorReply({
        visitorEmail: message.email,
        visitorName: message.name,
        replyMessage
      });
    } catch (emailError) {
      console.error('Error sending reply email:', emailError);
    }

    return res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error replying to message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending reply'
    });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Visitor.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting message'
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Visitor.countDocuments({ read: false });
    
    return res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting unread count'
    });
  }
};
