# TaskFlow 🗂️

A full-stack task management application built with **React**, **Node.js/Express**, and **SQLite**. TaskFlow helps users manage daily tasks with categories, priorities, due dates/times, dark mode, email OTP verification, forgot password, profile management, and automated email reminders.

---

## 🚀 Tech Stack

### Frontend
- **React 18** — UI framework
- **Vite** — Dev server and build tool
- **Tailwind CSS** — Utility-first styling
- **TypeScript** — Used in `TaskPage.tsx`
- **Lucide React** — Icon library
- **react-easy-crop** — Avatar image cropping

### Backend
- **Node.js + Express** — REST API server
- **SQLite** (via `sqlite` + `sqlite3`) — Local database
- **JWT** (`jsonwebtoken`) — Cookie-based authentication
- **bcrypt** — Password hashing
- **Multer** — File uploads for avatars
- **Nodemailer** — Email sending (OTP, reminders)
- **cookie-parser** — Cookie parsing middleware
- **cors** — Cross-origin resource sharing
- **dotenv** — Environment variable management

---

## 📁 Project Structure

```
TaskFlow/
│
├── backend/
│   ├── middleware/
│   │   ├── auth.js                  # JWT authMiddleware
│   │   └── upload.js                # Multer avatar upload config
│   ├── routes/
│   │   └── authRoutes.js            # All auth routes
│   ├── utils/
│   │   ├── mailer.js                # Nodemailer — OTP, reset, reminder emails
│   │   └── reminderScheduler.js     # Task reminder scheduler (runs every 60s)
│   ├── uploads/                     # Uploaded avatar images (auto-created)
│   ├── .env                         # Environment variables (never commit)
│   ├── database.js                  # SQLite connection + table creation + migrations
│   ├── server.js                    # Express app + all task API routes
│   ├── taskflow.db                  # SQLite database (auto-created)
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── PriorityDot.jsx          # Priority color dot
    │   │   │   └── SearchBar.jsx            # Search input
    │   │   ├── dashboard/
    │   │   │   └── StatCard.jsx             # Stat cards (total/pending/completed/overdue)
    │   │   ├── tasks/
    │   │   │   ├── AddTaskModal.jsx         # Create task modal
    │   │   │   ├── CategoryCard.jsx         # Category group card (Overview page)
    │   │   │   ├── TaskBadge.jsx            # Category badge with dark mode
    │   │   │   ├── TaskFilter.jsx           # Filter tab bar
    │   │   │   ├── TaskItem.jsx             # Task row — expand, edit, delete + EditTaskModal
    │   │   │   └── TaskList.jsx             # Renders list of TaskItems
    │   │   ├── ChangePasswordModal.jsx      # Change password form
    │   │   └── EditProfileModal.jsx         # Edit display name modal
    │   ├── hooks/
    │   │   └── useTasks.js                  # Task state, CRUD, filters, stats
    │   ├── layout/
    │   │   ├── MainLayout.jsx               # Main layout wrapper
    │   │   └── Sidebar.jsx                  # Navigation + category quick filters
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   └── AuthPage.jsx             # Login, Signup (3-step OTP), Forgot Password
    │   │   ├── CompletedPage.jsx            # Completed tasks view
    │   │   ├── Dashboard.jsx                # Stats + today tasks + efficiency chart
    │   │   ├── Overview.jsx                 # Category expandable view
    │   │   ├── Settings.jsx                 # Profile, avatar, dark mode, password
    │   │   └── TaskPage.tsx                 # Task list with search + filter tabs
    │   ├── services/
    │   │   └── TaskService.js               # All API fetch calls
    │   ├── utils/
    │   │   └── cropImage.js                 # Canvas crop utility for react-easy-crop
    │   ├── App.css
    │   ├── App.jsx                          # Root — auth, dark mode, screen routing
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm
- Gmail account with App Password enabled

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd TaskFlow
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create **`backend/.env`**:
```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_16char_app_password
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start backend:
```bash
node server.js
```

Backend runs on **http://localhost:5000**

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

> Both servers must be running simultaneously in separate terminals.

---

## 🔧 Vite Proxy (`vite.config.js`)

```js
server: {
  proxy: {
    "/api": { target: "http://localhost:5000", changeOrigin: true },
    "/uploads": { target: "http://localhost:5000", changeOrigin: true }
  }
}
```

All frontend fetch calls use relative paths like `/api/tasks`.

---

## 📧 Gmail App Password Setup

Required for OTP emails and task reminders:

1. Go to Google Account → **Security**
2. Enable **2-Step Verification**
3. Go to **App Passwords** → Select "Mail" → "Other"
4. Copy the 16-character password → paste in `.env` as `GMAIL_PASS`

---

## 🗄️ Database Schema

**`users` table**
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| name | TEXT | Required |
| email | TEXT | Unique |
| password | TEXT | Bcrypt hashed |
| avatar | TEXT | Path e.g. `/uploads/file.jpg` |
| created_at | TEXT | Auto timestamp |

**`tasks` table**
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| user_id | INTEGER | FK → users.id (CASCADE) |
| title | TEXT | Required |
| description | TEXT | Optional |
| category | TEXT | `work` / `personal` / `study` |
| priority | TEXT | `high` / `medium` / `low` |
| due_date | TEXT | `YYYY-MM-DD` |
| due_time | TEXT | `HH:MM` — optional |
| is_done | INTEGER | `0` = pending, `1` = done |
| created_at | TEXT | Auto timestamp |

**`otp_verification` table**
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| email | TEXT | Target email |
| otp | TEXT | 6-digit code |
| expires_at | INTEGER | Unix timestamp (10 min TTL) |
| created_at | TEXT | Auto timestamp |

> All migrations run automatically on server start via try/catch `ALTER TABLE`.

---

## 🔐 Authentication Flow

### Signup (3-step OTP verified)
```
Step 1 → Enter email → POST /api/auth/send-otp → OTP sent to Gmail
Step 2 → Enter OTP  → POST /api/auth/verify-reset-otp → verified
Step 3 → Enter name + password → POST /api/auth/signup → account created
```

### Login
```
Enter email + password → POST /api/auth/login → JWT cookie set
```

### Forgot Password (3-step)
```
Step 1 → Enter registered email → POST /api/auth/forgot-password
Step 2 → Enter OTP → POST /api/auth/verify-reset-otp
Step 3 → Enter new password → POST /api/auth/reset-password
```

### Session Persistence
- On every load → `GET /api/auth/me` with `credentials: "include"`
- Valid cookie → user restored → dashboard shown
- Invalid/expired → login page shown
- `activeScreen` persisted in `localStorage`

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/send-otp` | Send signup OTP to email |
| POST | `/signup` | Create account (requires OTP) |
| POST | `/login` | Login, sets JWT cookie |
| GET | `/me` | Get current user from cookie |
| POST | `/logout` | Clear auth cookie |
| POST | `/forgot-password` | Send password reset OTP |
| POST | `/verify-reset-otp` | Verify OTP (signup + forgot password) |
| POST | `/reset-password` | Set new password with OTP |
| POST | `/change-name` | Update display name |
| POST | `/change-password` | Change password (requires current) |
| POST | `/upload-avatar` | Upload profile photo |

### Task Routes — `/api/tasks`

All protected by `authMiddleware`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks?status=overdue` | Get overdue tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/done` | Toggle completion |
| DELETE | `/api/tasks/:id` | Delete task |

---

## ✨ Features

### Task Management
- Create, edit, delete tasks
- Toggle completion
- Expandable row — description, due date/time, edit/delete actions
- Optional due time shown in 12hr AM/PM format
- Past dates blocked — only today or future allowed

### Filters & Search
- Search by title
- Filter tabs: **All, Today, Pending, Completed, Overdue**
- Sidebar category filters: **Work, Personal, Study**
- Category filter + tab filter work together (e.g. Work → Pending)
- Today filter shows both pending and completed tasks
- Timezone-safe via `toLocaleDateString('en-CA')`

### Dashboard
- Stat cards: Total, Due Today, Completed, Overdue
- Upcoming Today list (max 5 pending tasks)
- Efficiency donut chart

### Email Features
- **Signup OTP** — verify email before account creation
- **Forgot Password OTP** — secure reset flow
- **Task Reminders** — automatic emails 5 minutes before and at exact due time

### Task Reminder Scheduler
- Runs every 60 seconds on the backend
- Sends reminder email 5 minutes before task due time
- Sends reminder email at exact due time
- Uses `sentReminders` Set to prevent duplicate emails
- Only triggers for tasks with `due_time` set and `is_done = 0`

### Settings
- Edit display name
- Upload and crop profile photo (react-easy-crop + zoom slider)
- Change password
- Dark / Light mode toggle — persists in `localStorage`

### Dark Mode
- Global state in `App.jsx` — light by default
- Adds/removes `dark` class on `<html>`
- `darkMode` prop passed to every component
- Persists via `localStorage`

---

## 🐛 Known Issues & Notes

- Server must be running for reminders to fire — missed if server is offline at due time
- SQLite `DATE('now')` uses UTC — frontend uses `toLocaleDateString('en-CA')` for IST compatibility
- Avatar images stored in `/backend/uploads/` — add to `.gitignore`
- No pagination — all tasks loaded in one query

---

## 📦 Dependencies

### Frontend
```
react, react-dom, vite
tailwindcss, postcss, autoprefixer
lucide-react
react-easy-crop
typescript
```

### Backend
```
express
sqlite, sqlite3
jsonwebtoken
bcrypt
multer
nodemailer
cookie-parser
cors
dotenv
```

---

## 🔒 `.gitignore`

```
# backend
node_modules
.env
uploads/
taskflow.db

# frontend
node_modules
dist
```

---

## 🚀 Production Checklist

- [ ] Move all secrets to `.env` (JWT_SECRET, GMAIL credentials)
- [ ] Set `secure: true` on cookie (requires HTTPS)
- [ ] Set `sameSite: "strict"` on cookie
- [ ] Replace SQLite with PostgreSQL or MySQL
- [ ] Add input validation (express-validator)
- [ ] Add rate limiting on auth routes (express-rate-limit)
- [ ] Store avatars in cloud storage (S3, Cloudinary)
- [ ] Use a job queue for reminders (Bull, BullMQ) instead of setInterval
- [ ] Add refresh token logic
- [ ] Add React error boundary
