const express = require('express');
const {
  sendMessage,
  getAllMessages,
  getMessage,
  replyToMessage,
  deleteMessage,
  getUnreadCount
} = require('../controllers/visitorController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/send-message', sendMessage);

// Protected routes (Admin only)
router.get('/all-messages', auth, isAdmin, getAllMessages);
router.get('/unread-count', auth, isAdmin, getUnreadCount);
router.get('/:id', auth, isAdmin, getMessage);
router.put('/:id/reply', auth, isAdmin, replyToMessage);
router.delete('/:id', auth, isAdmin, deleteMessage);

module.exports = router;
