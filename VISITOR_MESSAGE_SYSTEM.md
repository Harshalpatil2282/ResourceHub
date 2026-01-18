# 📧 Visitor Message Notification System - Complete Guide

## 🎯 Overview

This system allows visitors to send messages through a contact form, with automatic email notifications sent to your admin email address. The admin can view, manage, and reply to messages through a dedicated dashboard.

---

## 📋 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VISITOR (Frontend)                      │
│                   ContactForm Component                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ POST /api/visitor/send-message
                      │ (name, email, phone, subject, message)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Backend)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  visitorController.sendMessage()                     │  │
│  │  - Validate input                                    │  │
│  │  - Save to MongoDB (Visitor model)                   │  │
│  │  - Trigger email notification                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                ┌─────┴─────┐
                ▼           ▼
        ┌────────────┐  ┌──────────────────┐
        │  MongoDB   │  │  Email Service   │
        │   (Store)  │  │   (Nodemailer)   │
        └────────────┘  └────────┬─────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
              ┌───────────┐            ┌───────────────┐
              │ Admin     │            │ Visitor Email │
              │ Email     │            │ (Reply Only)  │
              └───────────┘            └───────────────┘
                    │
                    ▼
        ┌─────────────────────────────┐
        │ Admin Dashboard             │
        │ VisitorMessagesDashboard    │
        │ - View Messages             │
        │ - Reply to Messages         │
        │ - Mark as Read              │
        │ - Delete Messages           │
        └─────────────────────────────┘
```

---

## 🗂️ Files Created

### Backend Files

#### 1. **[server/models/Visitor.js](server/models/Visitor.js)** - Database Model
- Schema for storing visitor messages
- Fields: name, email, phone, subject, message, ipAddress, read, replied, replyMessage
- Timestamps tracking

#### 2. **[server/controllers/visitorController.js](server/controllers/visitorController.js)** - Business Logic
- `sendMessage()` - Accept and process visitor messages
- `getAllMessages()` - Retrieve all messages (admin)
- `getMessage()` - Get single message
- `replyToMessage()` - Send reply to visitor
- `deleteMessage()` - Delete message
- `getUnreadCount()` - Get unread message count

#### 3. **[server/routes/visitorRoutes.js](server/routes/visitorRoutes.js)** - API Routes
```
POST   /api/visitor/send-message          (Public)
GET    /api/visitor/all-messages          (Admin)
GET    /api/visitor/unread-count          (Admin)
GET    /api/visitor/:id                   (Admin)
PUT    /api/visitor/:id/reply             (Admin)
DELETE /api/visitor/:id                   (Admin)
```

#### 4. **[server/config/email.js](server/config/email.js)** - Email Service (Updated)
- `sendVisitorMessage()` - Beautiful HTML email to admin
- `sendVisitorReply()` - Reply email to visitor

### Frontend Files

#### 5. **[client/src/component/common/ContactForm.js](client/src/component/common/ContactForm.js)** - Contact Form Component
- Public-facing form for visitors
- Client-side validation
- Loading and success/error states
- Responsive design

#### 6. **[client/src/styles/ContactForm.css](client/src/styles/ContactForm.css)** - Contact Form Styling
- Beautiful gradient design
- Dark mode support
- Animations and transitions

#### 7. **[client/src/component/admin/VisitorMessagesDashboard.js](client/src/component/admin/VisitorMessagesDashboard.js)** - Admin Dashboard
- View all visitor messages
- Filter by status (unread, pending, replied)
- Modal to view full message details
- Reply to visitors
- Delete messages
- Unread message counter

#### 8. **[client/src/styles/VisitorMessagesDashboard.css](client/src/styles/VisitorMessagesDashboard.css)** - Dashboard Styling
- Professional dashboard design
- Stats cards
- Modal styling
- Dark mode support

---

## 🚀 Integration Steps

### Step 1: Install Dependencies (if needed)
```bash
# Backend (already has nodemailer)
# No additional packages needed

# Frontend
# React already available
```

### Step 2: Add Routes to Server
The route has already been added to [server/server.js](server/server.js):
```javascript
const visitorRoutes = require('./routes/visitorRoutes');
app.use('/api/visitor', visitorRoutes);
```

### Step 3: Update Auth Middleware (if needed)
Make sure [server/middleware/auth.js](server/middleware/auth.js) has `isAdmin` middleware:
```javascript
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
```

### Step 4: Add Components to Pages

**For Public Contact Page** - Add to your Home or Contact page:
```javascript
import ContactForm from './component/common/ContactForm';

// In JSX:
<ContactForm />
```

**For Admin Dashboard** - Add to AdminDashboard:
```javascript
import VisitorMessagesDashboard from './component/admin/VisitorMessagesDashboard';

// Add route in AdminDashboard or routing:
<Route path="/admin/visitor-messages" element={<VisitorMessagesDashboard />} />
```

### Step 5: Update Navigation
Add link to visitor messages in admin navbar:
```javascript
<Link to="/admin/visitor-messages">
  📧 Messages ({unreadCount})
</Link>
```

---

## 📧 Email Template

### Admin Notification Email
The admin receives a beautiful formatted email with:
- Visitor's name, email, phone
- Subject line
- Full message content
- Direct link to admin dashboard
- Professional styling

### Visitor Reply Email
When admin replies, visitor receives:
- Admin's response message
- Professional template
- Branded footer

---

## 🔐 Security Features

✅ **Input Validation**
- Name, email, subject, message required
- Max length validation on fields
- Email format validation

✅ **Authentication**
- Admin routes require JWT token
- Role-based access control (admin only)

✅ **Data Protection**
- IP address logging for spam detection
- Message read/unread tracking
- Reply status tracking

✅ **Rate Limiting (Optional)**
Consider adding rate limiting:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per window
});

router.post('/send-message', limiter, sendMessage);
```

---

## 🎨 Customization Options

### Change Email Styling
Edit [server/config/email.js](server/config/email.js) to customize:
- Colors and gradients
- Company branding
- Email templates

### Modify Form Fields
In [client/src/component/common/ContactForm.js](client/src/component/common/ContactForm.js):
- Add/remove form fields
- Change validation rules
- Update field labels

### Customize Dashboard
In [client/src/component/admin/VisitorMessagesDashboard.js](client/src/component/admin/VisitorMessagesDashboard.js):
- Change filter options
- Modify display layout
- Add export functionality

---

## 🧪 Testing the System

### Test Public Form
1. Navigate to contact form page
2. Fill in all fields
3. Click "Send Message"
4. Check admin email inbox for notification

### Test Admin Dashboard
1. Log in as admin
2. Navigate to /admin/visitor-messages
3. View the message you just sent
4. Click to open and reply
5. Check visitor's email for reply

---

## 📊 API Response Examples

### Send Message (Success)
```json
{
  "success": true,
  "message": "Message sent successfully! We will get back to you soon.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "visitor@example.com"
  }
}
```

### Get All Messages
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Question about resources",
      "message": "Hi, I wanted to ask...",
      "read": true,
      "replied": false,
      "createdAt": "2024-01-18T10:30:00Z"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Emails Not Sending
1. Check `.env` file for correct EMAIL_USER and EMAIL_PASS
2. Verify Gmail "App Password" is being used (not regular password)
3. Check server logs for errors
4. Ensure nodemailer is installed: `npm install nodemailer`

### Admin Dashboard Not Showing Messages
1. Verify user has admin role
2. Check browser console for API errors
3. Ensure JWT token is valid
4. Verify MongoDB connection

### Form Not Submitting
1. Check REACT_APP_API_URL environment variable
2. Verify backend server is running
3. Check browser console for CORS errors
4. Verify all required fields are filled

---

## 📱 Mobile Responsiveness

✅ Contact form is fully responsive
✅ Admin dashboard works on tablets
✅ Email templates are mobile-friendly
✅ All components have mobile breakpoints

---

## 🔄 Next Steps

1. **Test the entire flow** with a test message
2. **Customize email templates** with your branding
3. **Add to navigation** in your app
4. **Set up notifications** (optional: desktop/SMS notifications)
5. **Monitor messages** regularly for visitor inquiries
6. **Respond promptly** to maintain good user experience

---

## 📞 Support

For issues or questions about the implementation, check:
- Server logs: `node server.js`
- Browser console: F12 → Console tab
- Network tab: F12 → Network tab
- MongoDB Atlas for stored messages

---

**Happy communicating with your visitors! 🚀**
