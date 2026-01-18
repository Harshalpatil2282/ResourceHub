# 📊 Visitor Message System - Detailed Workflow

## 🔄 Complete Message Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          STEP 1: VISITOR SENDS MESSAGE                      │
└─────────────────────────────────────────────────────────────────────────────┘

  Website Visitor
       │
       ├─ Fills Contact Form
       │  ├─ Name: "John Doe"
       │  ├─ Email: "john@example.com"
       │  ├─ Phone: "9876543210"
       │  ├─ Subject: "Question about resources"
       │  └─ Message: "Hi, I have a question..."
       │
       └─► Clicks "Send Message"
           │
           ▼
    ┌──────────────────────┐
    │  Client Validation   │
    ├──────────────────────┤
    │ ✓ All fields filled  │
    │ ✓ Valid email format │
    │ ✓ Message not empty  │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────────────────────────┐
    │  API Request (POST)                      │
    ├──────────────────────────────────────────┤
    │ Endpoint: /api/visitor/send-message      │
    │ Method: POST                             │
    │ Body: {name, email, phone, subject, msg} │
    └──────────┬───────────────────────────────┘
               │
               │ (Network Request)
               │
               ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│              STEP 2: SERVER PROCESSES MESSAGE                               │
└─────────────────────────────────────────────────────────────────────────────┘

    Server (Node.js/Express)
           │
           ▼
    ┌─────────────────────────────────┐
    │ visitorController.sendMessage() │
    └────────────┬────────────────────┘
                 │
                 ├─ Validate input
                 │  ├─ Check required fields
                 │  ├─ Validate email format
                 │  └─ Check max lengths
                 │
                 ├─ Get visitor IP address
                 │
                 └─ Create MongoDB document
                    {
                      name: "John Doe",
                      email: "john@example.com",
                      phone: "9876543210",
                      subject: "Question about resources",
                      message: "Hi, I have a question...",
                      ipAddress: "192.168.1.1",
                      read: false,
                      replied: false,
                      createdAt: <timestamp>,
                      _id: <generated>
                    }
                    │
                    └─► Save to MongoDB
                        │
                        ▼
                    ┌─────────────┐
                    │  MongoDB    │
                    │  (Visitor   │
                    │   Collection)│
                    └─────────────┘

           Meanwhile...
               │
               ▼
    ┌──────────────────────────────────┐
    │ sendVisitorMessage() - Email     │
    └────────────┬─────────────────────┘
                 │
                 ├─ Create HTML email template
                 │
                 ├─ Add visitor information
                 │  ├─ From: John Doe (john@example.com)
                 │  ├─ Subject: Question about resources
                 │  └─ Message content
                 │
                 ├─ Add admin dashboard link
                 │
                 └─ Send email via Nodemailer
                    │
                    ▼
                ┌─────────────────┐
                │ Gmail SMTP      │
                │ (Email Service) │
                └────────┬────────┘
                         │
                         ▼
                    ┌──────────────────────────────┐
                    │ Admin Email Inbox            │
                    │ ResourceHubOfficial1@...    │
                    └──────────────────────────────┘

           Finally...
               │
               ▼
    ┌──────────────────────────────────────┐
    │ API Response to Visitor              │
    ├──────────────────────────────────────┤
    │ Status: 201 (Created)                │
    │ Response: {                          │
    │   success: true,                     │
    │   message: "Message sent success!"   │
    │   data: {                            │
    │     id: "507f1f77bcf...",            │
    │     email: "john@example.com"        │
    │   }                                  │
    │ }                                    │
    └──────────┬───────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────┐
    │ Frontend Shows Success Message       │
    ├──────────────────────────────────────┤
    │ "✓ Message sent successfully!"       │
    │ "We'll get back to you soon."        │
    │ Form clears...                       │
    └──────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│              STEP 3: ADMIN REVIEWS MESSAGES                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    Admin User
       │
       ├─ Receives email notification
       │  └─ "New Message: Question about resources"
       │
       ├─ Logs into ResourceHub
       │  └─ Admin Dashboard
       │
       ▼
    ┌─────────────────────────────────────┐
    │ VisitorMessagesDashboard            │
    ├─────────────────────────────────────┤
    │ 📊 Stats:                           │
    │    • Total: 1                       │
    │    • Unread: 1  ⚠️                  │
    │    • Replied: 0                     │
    │                                     │
    │ 📧 Message List:                    │
    │    ┌─────────────────────────────┐  │
    │    │ [NEW] John Doe              │  │
    │    │ Question about resources    │  │
    │    │ john@example.com            │  │
    │    │ 2024-01-18 10:30 AM         │  │
    │    └─────────────────────────────┘  │
    │           │                         │
    │           ▼                         │
    │    Click to view details...        │
    └─────────────────────────────────────┘
               │
               ▼
    ┌────────────────────────────────────────┐
    │ Modal: View Full Message               │
    ├────────────────────────────────────────┤
    │ From: John Doe                         │
    │ Email: john@example.com                │
    │ Phone: 9876543210                      │
    │ Date: Jan 18, 2024 10:30 AM            │
    │                                        │
    │ Subject: Question about resources      │
    │                                        │
    │ Message:                               │
    │ "Hi, I have a question about..."       │
    │                                        │
    │ [Reply TextArea]                       │
    │ Type your response...                  │
    │                                        │
    │ [Send Reply]  [Delete]                 │
    └────────────┬───────────────────────────┘
                 │
                 ▼


┌─────────────────────────────────────────────────────────────────────────────┐
│              STEP 4: ADMIN SENDS REPLY                                      │
└─────────────────────────────────────────────────────────────────────────────┘

    Admin Types Reply
        │
        ├─ "Thanks for your question..."
        │
        ▼
    Clicks [Send Reply]
        │
        ▼
    ┌────────────────────────────────────────┐
    │ API Request (PUT)                      │
    ├────────────────────────────────────────┤
    │ Endpoint: /api/visitor/:messageId/reply│
    │ Method: PUT                            │
    │ Body: { replyMessage: "Thanks..." }    │
    │ Header: Authorization: Bearer <token>  │
    └────────────┬───────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────────┐
    │ Server: replyToMessage()                 │
    ├──────────────────────────────────────────┤
    │ 1. Find message by ID in MongoDB         │
    │ 2. Update with:                          │
    │    - replyMessage: "Thanks..."           │
    │    - replied: true                       │
    │ 3. Save to database                      │
    │ 4. Send reply email to visitor           │
    └────────────┬───────────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────┐
    │ sendVisitorReply() - Email           │
    ├──────────────────────────────────────┤
    │ To: john@example.com                 │
    │ Subject: Re: Your ResourceHub Message│
    │ Body: <formatted HTML email>         │
    │       "Hi John,                      │
    │        Thanks for your question...   │
    │        Best regards,                 │
    │        ResourceHub Team"             │
    └────────────┬───────────────────────────┘
                 │
                 ▼
            Gmail SMTP
                 │
                 ▼
    ┌──────────────────────────────────┐
    │ Visitor Email Inbox              │
    │ (john@example.com)               │
    ├──────────────────────────────────┤
    │ ✉️ Re: Your ResourceHub Message  │
    │                                  │
    │ "Hi John,                        │
    │  Thanks for your question...     │
    │  [Full admin response]           │
    │  Best regards,                   │
    │  ResourceHub Team"               │
    └──────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│              STEP 5: MESSAGE MANAGEMENT COMPLETE                            │
└─────────────────────────────────────────────────────────────────────────────┘

    Admin Dashboard Updated:
        │
        ├─ Message marked as [REPLIED]
        │
        ├─ Message no longer in "Pending" filter
        │
        ├─ Message appears in "Replied" section
        │
        └─ Can still:
           ├─ View message again
           ├─ Update reply (PUT request)
           └─ Delete message


┌──────────────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA VISUALIZATION                         │
└──────────────────────────────────────────────────────────────────────────┘

    MongoDB: resourcehub_db

    ┌────────────────────────────────────────────────────────┐
    │               Visitor Collection                       │
    ├────────────────────────────────────────────────────────┤
    │                                                        │
    │  Document Example:                                    │
    │  {                                                    │
    │    _id: ObjectId("507f1f77bcf86cd799439011"),         │
    │    name: "John Doe",                    ┐             │
    │    email: "john@example.com",           │             │
    │    phone: "9876543210",                 ├─ From Form  │
    │    subject: "Question about resources", │             │
    │    message: "Hi, I have a question...", ┘             │
    │    ipAddress: "192.168.1.1",            ┐             │
    │    read: true,                          ├─ Tracking  │
    │    replied: true,                       │             │
    │    replyMessage: "Thanks...",           ┘             │
    │    createdAt: 2024-01-18T10:30:00Z,                  │
    │    updatedAt: 2024-01-18T10:35:00Z                   │
    │  }                                                    │
    │                                                        │
    └────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                    API RESPONSE EXAMPLES                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Send Message Response:
┌─────────────────────────────────────────┐
│ POST /api/visitor/send-message          │
│ Status: 201 Created                     │
│ {                                       │
│   "success": true,                      │
│   "message": "Message sent successfully!│
│              We will get back soon.",   │
│   "data": {                             │
│     "id": "507f1f77bcf86cd799439011",  │
│     "email": "john@example.com"         │
│   }                                     │
│ }                                       │
└─────────────────────────────────────────┘

Get All Messages Response:
┌──────────────────────────────────────┐
│ GET /api/visitor/all-messages        │
│ Status: 200 OK                       │
│ {                                    │
│   "success": true,                   │
│   "count": 1,                        │
│   "data": [                          │
│     {                                │
│       "_id": "507f1f77...",         │
│       "name": "John Doe",            │
│       "email": "john@...",           │
│       "subject": "Question...",      │
│       "message": "Hi...",            │
│       "read": true,                  │
│       "replied": true,               │
│       "createdAt": "2024-01-18...",  │
│       ...                            │
│     }                                │
│   ]                                  │
│ }                                    │
└──────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                    SECURITY FLOW                                            │
└─────────────────────────────────────────────────────────────────────────────┘

Admin Routes Protection:
    │
    ├─ Request to GET /api/visitor/all-messages
    │
    ├─ Check: Has Authorization header?
    │  └─ NO → Return 401 Unauthorized
    │
    ├─ Extract JWT Token
    │
    ├─ Verify Token Signature
    │  └─ INVALID → Return 403 Forbidden
    │
    ├─ Check: User role = "admin"?
    │  └─ NO → Return 403 Access Denied
    │
    └─ ✅ ALLOWED → Process request

```

---

## 📈 Message Status Lifecycle

```
┌────────────┐
│   Created  │  (Visitor sends message)
└─────┬──────┘
      │
      ▼
┌────────────┐
│  Received  │  (Admin email notification sent)
└─────┬──────┘
      │
      ├─────────────────┬─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│  Unread  │   │   Read   │   │ Archived │
│ (Pending)│   │ (Pending)│   │ (Deleted)│
└────┬─────┘   └────┬─────┘   └──────────┘
     │              │
     └──────────┬───┘
                │
                ▼
        ┌──────────────┐
        │    Replied   │  (Admin sent response)
        │  (Completed) │  (Visitor notified via email)
        └──────────────┘
```

---

**This complete workflow ensures smooth communication between visitors and admin!** ✨
