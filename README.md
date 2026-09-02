<div align="center">

# 📚 ResourceHub

### A University Academic Resource Management Platform
### Actively Used By College Students

**Live Demo → [https://resourcehub-7u3d.onrender.com/](https://resourcehub-7u3d.onrender.com/)**

[![Live](https://img.shields.io/badge/Live-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://resourcehub-7u3d.onrender.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

---

## 📖 Table of Contents

- [About](#-about-the-project)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Component Interaction](#-component-interaction)
- [Frontend Routes](#-frontend-routes)
- [User Roles](#-user-roles--access)
- [Local Setup](#-getting-started-local-setup)
- [Environment Variables](#-environment-variables)

---

## 🌐 About the Project

**ResourceHub** is a full-stack MERN web application that helps university students find, preview, and download academic resources — notes, PPTs, PDFs, lab manuals — organized by **University → Program → Semester → Subject**.

Admins manage the entire content library from a powerful dashboard — uploading multiple files at once, organizing them into folder trees, managing universities, programs, and responding to visitor messages. Guest users can browse all resources without registering.

---

## 🔗 Live Demo

> **[https://resourcehub-7u3d.onrender.com/](https://resourcehub-7u3d.onrender.com/)**

| Role | How to Access |
|------|---------------|
| **Guest** | Click **"Continue as Guest"** on the login page |
| **Student** | Register with your university email |
| **Admin** | Contact the repo owner |

---

## ✨ Key Features

### 👤 For Students / Users
- 🔐 JWT-based auth — register, login, email verification, forgot/reset password
- 🎓 Guest access — browse all resources without registration
- 🔍 Search files by name across the platform
- 🗂️ Hierarchical browsing — University → Program → Semester → Subject
- 👁️ Inline preview — PDF, PPT, PPTX, DOC, DOCX via Google Docs Viewer modal
- ⬇️ Download with correct extension — cross-origin blob fetch preserves `.pdf`, `.pptx` etc.
- 📤 Contribute resources — submit files for admin review
- 🌙 Dark / Light mode toggle

### 🛠️ For Admins
- 📊 Overview dashboard — live stat cards (universities, programs, folders, files)
- 🏫 Manage Universities — create and view all universities
- 📚 Manage Programs — scoped per university
- 📂 Manage Folders — cascading Uni → Program → Parent → Subfolder creation
- 📁 File System Navigator — 4-step cascade upload to any folder level
- 🗂️ Multi-file Upload Queue — drag & drop, sequential upload, per-file status, progress bar, retry
- 📋 Activity Log — color-coded table of all actions with user and timestamp
- 💬 Visitor Messages Inbox — unread badge, inline reply, delete with confirm
- 📱 Fully responsive — collapsible sidebar with hamburger on mobile
- 🔔 Toast notifications — slide-in feedback for every action

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component framework |
| React Router v6 | Client-side routing & role-based guards |
| Axios | HTTP client with `/api` base URL |
| react-modal | File preview modal |
| Context API | Global dark/light theme state |
| CSS3 Custom | Glassmorphism dark theme, responsive grid |
| Google Docs Viewer | In-browser preview of PDF, PPT, DOCX |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express 4.18 | REST API framework |
| MongoDB + Mongoose 8 | NoSQL database & ODM |
| jsonwebtoken | Stateless JWT authentication |
| bcryptjs | Secure password hashing |
| Multer | Multipart file upload middleware |
| Cloudinary | Cloud file storage (resource_type: raw) |
| Nodemailer | Email verification & password reset |
| CORS | Dynamic origin whitelist |

### Hosting
| Service | Purpose |
|---------|---------|
| Render | Full-stack hosting — Express serves built React app |
| MongoDB Atlas | Managed cloud database |
| Cloudinary CDN | Global file delivery |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT (React SPA)                    │
│  Browser → React Router → Pages → Components           │
│                       │                                 │
│               Axios (baseURL: /api)                     │
└───────────────────────┬─────────────────────────────────┘
                        │  HTTPS REST
┌───────────────────────▼─────────────────────────────────┐
│              SERVER (Node.js + Express)                  │
│                                                         │
│  /api/auth         authRoutes    → authController       │
│  /api/universities               → universityController │
│  /api/programs                   → programController    │
│  /api/folders                    → folderController     │
│  /api/files                      → uploadController     │
│  /api/activities                 → activityController   │
│  /api/visitor                    → visitorController    │
│                                                         │
│  Middleware: verifyToken → checkRole(['admin','user'])   │
│  Static:     serves client/build (production)           │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
       ┌───────▼──────┐          ┌────────▼───────┐
       │ MongoDB Atlas │          │   Cloudinary   │
       │ 8 Collections │          │ raw file store │
       └──────────────┘          └────────────────┘
```

---

## 📁 Project Structure

```
ResourceHub/
│
├── client/
│   └── src/
│       ├── App.js                      # Root router + role guards
│       ├── index.js
│       ├── pages/
│       │   ├── Home.js                 # Public landing page
│       │   ├── Login.js                # Login + Guest access
│       │   ├── Register.js             # Register + university select
│       │   ├── ForgotPassword.js       # Trigger reset email
│       │   ├── ResetPassword.js        # Token-based reset
│       │   ├── VerifyEmail.js          # Email verification
│       │   ├── UserViewPage.js         # Student resource browser
│       │   ├── AdminDashboard.js       # Admin panel (8-tab sidebar)
│       │   └── AdminContributionDashboard.js
│       ├── component/
│       │   ├── Navbar.js
│       │   ├── Loader.js
│       │   ├── admin/
│       │   │   ├── UniversityForm.js
│       │   │   ├── ProgramForm.js
│       │   │   ├── FolderForm.js
│       │   │   ├── FileUpload.js
│       │   │   ├── FileListAdmin.js
│       │   │   ├── ActivityLog.js
│       │   │   ├── DragDropUpload.js
│       │   │   ├── VisitorMessagesDashboard.js
│       │   │   └── UploadFileToFolder.js
│       │   ├── user/
│       │   │   ├── UniversitySelector.js   # Step 1
│       │   │   ├── ProgramList.js          # Step 2
│       │   │   ├── FolderList.js           # Step 3 — Semesters
│       │   │   ├── SubfolderList.js        # Step 4 — Subjects
│       │   │   ├── FileCard.js             # Preview + Download
│       │   │   ├── FileListUser.js
│       │   │   ├── PreviewModal.js         # Google Docs Viewer
│       │   │   ├── Breadcrumbs.js
│       │   │   └── ContributionForm.js
│       │   └── common/
│       │       ├── SearchBar.js
│       │       ├── ContactForm.js
│       │       ├── HorizontalScroller.js
│       │       └── ThemeToggle.js
│       ├── context/ThemeContext.js
│       ├── routes/RoleRoute.js
│       ├── services/api.js             # Axios instance
│       └── styles/
│           ├── AdminDashboard.css
│           └── UserDashboard.css
│
└── server/
    ├── server.js                       # Entry point
    ├── config/
    │   ├── cloudinary.js
    │   └── email.js
    ├── middleware/auth.js              # verifyToken + checkRole
    ├── models/
    │   ├── User.js
    │   ├── University.js
    │   ├── Program.js
    │   ├── Folder.js
    │   ├── File.js
    │   ├── Activity.js
    │   ├── Contribution.js
    │   └── Visitor.js
    ├── controllers/
    │   ├── authController.js
    │   ├── universityController.js
    │   ├── programController.js
    │   ├── folderController.js
    │   ├── uploadController.js
    │   ├── fileController.js
    │   ├── activityController.js
    │   ├── contributionController.js
    │   └── visitorController.js
    └── routes/
        ├── authRoutes.js
        ├── universityRoutes.js
        ├── programRoutes.js
        ├── folderRoutes.js
        ├── fileRoutes.js
        ├── activityRoutes.js
        ├── contributionRoutes.js
        ├── adminContributionRoutes.js
        └── visitorRoutes.js
```

---

## 🗄 Database Schema

```
University   { name }

Program      { name, university→University }

Folder       { name, university, program,
               parentFolder→Folder  ← null=Semester / set=Subject }

File         { name, type(MIME), url(Cloudinary), cloudinaryPublicId,
               folderId, university, canDownload, uploadedBy→User }

User         { name, email, password(hash), role(admin|user),
               university→University, isVerified,
               emailVerificationToken, resetPasswordToken }

Activity     { userId→User, fileId→File, action(upload|delete) }

Visitor      { name, email, phone, subject, message,
               read, replied, replyMessage, ipAddress }

Contribution { universityId, programId, folderId, subfolderId,
               title, description, fileUrl(Cloudinary),
               status(pending|approved|rejected), submittedBy→User }
```

---

## 📡 API Reference

### Auth `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /register | Public | Register + send verification email |
| POST | /login | Public | Login → JWT |
| GET | /verify-email/:token | Public | Verify email |
| POST | /forgot-password | Public | Send reset link |
| POST | /reset-password/:token | Public | Reset password |
| POST | /guest-login | Public | Guest session token |

### Universities `/api/universities`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | / | All | List all |
| POST | / | Admin | Create |

### Programs `/api/programs`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /university/:id | All | Programs for a university |
| POST | / | Admin | Create |

### Folders `/api/folders`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | / | Admin | Create folder/subfolder |
| GET | /program/:id | All | Root folders (semesters) |
| GET | /subfolders/:parentId | All | Subject folders |
| GET | /all | Admin | All folders flat |
| GET | /detailed | Admin | All with populated refs |

### Files `/api/files`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /upload | Admin | Upload to Cloudinary |
| GET | /folder/:id | All | Files in folder |
| GET | /user | User | User's own files |
| GET | /search?q= | All | Search by name |
| DELETE | /:id | Admin | Delete file |
| PUT | /:id | Admin | Update metadata |

### Visitor `/api/visitor`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /send | Public | Submit contact message |
| GET | /all-messages | Admin | All messages (returns {data:[...]}) |
| GET | /unread-count | Admin | Unread count |
| PUT | /:id/reply | Admin | Reply to message |
| DELETE | /:id | Admin | Delete message |

### Activity `/api/activities`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | / | Admin | Recent activity log |

---

## 🔄 Component Interaction

### Student Browsing Flow

```
UserViewPage
  └─ UniversitySelector ── GET /api/universities ──────────────► DB
       └─ (select uni)
  └─ ProgramList ────────── GET /api/programs/university/:id ──► DB
       └─ (select program)
  └─ FolderList ─────────── GET /api/folders/program/:id ──────► DB
       └─ (select semester)
  └─ SubfolderList ──────── GET /api/folders/subfolders/:id ───► DB
       └─ (select subject)
  └─ FileListUser ────────── GET /api/files/folder/:id ─────────► DB
       └─ FileCard
             ├─ Preview → PreviewModal
             │             ├─ PDF/PPT/DOC → Google Docs Viewer iframe
             │             └─ Image       → <img>
             └─ Download → fetch(url) as Blob → save with .ext
```

### Admin Upload Queue Flow

```
AdminDashboard [Files & Upload Tab]
  ├─ Step1: University dropdown
  ├─ Step2: Program dropdown    ── GET /api/programs/university/:id
  ├─ Step3: Semester buttons    ── GET /api/folders/program/:id
  ├─ Step4: Subject buttons     ── GET /api/folders/subfolders/:id
  ├─ Drag & Drop Zone (multi)   ── addFilesToQueue(files)
  │
  └─ [Upload All] → handleQueueUpload()
       for each pending item:
         status → 'uploading'
         POST /api/files/upload → Cloudinary → MongoDB
         status → 'done' ✅ | 'error' ❌ (retry available)
       fetchFiles(folderId) → refresh grid
```

### Auth Flow

```
Login → POST /api/auth/login → JWT → localStorage
Guest → POST /api/auth/guest-login → guest token
RoleRoute → reads role → /admin or /user

Register → POST /api/auth/register → email sent
         → click link → GET /api/auth/verify-email/:token
         → isVerified:true → can login
```

---

## 🛣 Frontend Routes

| Path | Component | Access |
|------|-----------|--------|
| / | Home.js | Public |
| /login | Login.js | Public |
| /register | Register.js | Public |
| /forgot-password | ForgotPassword.js | Public |
| /reset-password/:token | ResetPassword.js | Public |
| /verify-email/:token | VerifyEmail.js | Public |
| /user | UserViewPage.js | 🔒 user / guest |
| /admin | AdminDashboard.js | 🔒 admin only |

---

## 👥 User Roles & Access

| Feature | Guest | User | Admin |
|---------|:-----:|:----:|:-----:|
| Browse resources | ✅ | ✅ | ✅ |
| Search files | ✅ | ✅ | ✅ |
| Preview files | ✅ | ✅ | ✅ |
| Download files | ✅ | ✅ | ✅ |
| Contribute resources | ❌ | ✅ | ✅ |
| Upload files | ❌ | ❌ | ✅ |
| Manage Universities | ❌ | ❌ | ✅ |
| Manage Programs | ❌ | ❌ | ✅ |
| Manage Folders | ❌ | ❌ | ✅ |
| View Activity Log | ❌ | ❌ | ✅ |
| Reply to Messages | ❌ | ❌ | ✅ |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Cloudinary free account
- Gmail App Password

### Clone & Install

```bash
git clone https://github.com/Harshalpatil2282/ResourceHub.git
cd ResourceHub

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### Configure

```bash
cp server/.env.example server/.env
# Fill in all values
```

### Run Development

```bash
# Terminal 1
cd server && npm run dev       # port 5000

# Terminal 2
cd client && npm start         # port 3000
```

### Build Production

```bash
cd server && npm run build && npm start
```

---

## 🔑 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/resourcehub

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (use App Password, NOT account password)
EMAIL_USER=your@gmail.com
EMAIL_PASS=xxxx_xxxx_xxxx_xxxx

# CORS
CLIENT_URL=https://resourcehub-7u3d.onrender.com
```

> ⚠️ Never commit `.env` to Git. It is already in `.gitignore`.

---

## 📸 Feature Implementation Details

| Feature | How It Works |
|---------|-------------|
| Inline Preview | Google Docs Viewer URL (`?url=encoded_cloudinary_url&embedded=true`) inside React Modal |
| Correct Download Extension | `fetch(url)` as Blob → `createObjectURL` → `<a download="file.pdf">` bypasses cross-origin restriction |
| Multi-file Queue | `uploadQueue` state array; sequential `for...of` loop; per-item status; retry resets to `'pending'` |
| File System Navigator | 4-step cascade; each step scopes data to previous selection; animated breadcrumb |
| Guest Access | Backend generates guest JWT; controllers skip `User.findById` for guest IDs |
| Email Verification | `crypto.randomBytes` token; 24h expiry; Nodemailer sends link |
| CORS Security | Dynamic whitelist — only `localhost:3000` and `CLIENT_URL` accepted |
| Activity Logging | Every upload/delete creates an `Activity` document linked to user + file |

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Harshal Patil**
GitHub: [@Harshalpatil2282](https://github.com/Harshalpatil2282)
Live: [https://resourcehub-7u3d.onrender.com/](https://resourcehub-7u3d.onrender.com/)

---

<div align="center">
Made with ❤️ for university students who deserve better access to study materials.

⭐ Star this repo if you found it helpful!
</div>
