# TaskFlow 🗂️

A full-stack task management application built with **React**, **Node.js/Express**, and **SQLite**. TaskFlow helps users manage their daily tasks with features like categories, priorities, due dates, dark mode, and profile management.

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
- **cookie-parser** — Cookie parsing middleware
- **cors** — Cross-origin resource sharing

---

## 📁 Project Structure

```
TaskFlow/
│
├── backend/
│   ├── middleware/
│   │   ├── auth.js                  # JWT authMiddleware — reads cookie, verifies token
│   │   └── upload.js                # Multer config for avatar uploads
│   ├── routes/
│   │   └── authRoutes.js            # /signup /login /me /logout /change-name /upload-avatar /change-password
│   ├── uploads/                     # Saved avatar images (auto-created)
│   ├── database.js                  # SQLite connection, table creation, column migrations
│   ├── server.js                    # Express app entry point + all task API routes
│   ├── taskflow.db                  # SQLite database file (auto-created)
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
    │   │   │   ├── PriorityDot.jsx          # Colored dot for task priority
    │   │   │   └── SearchBar.jsx            # Search input component
    │   │   ├── dashboard/
    │   │   │   └── StatCard.jsx             # Stat card (total/pending/completed/overdue)
    │   │   ├── tasks/
    │   │   │   ├── AddTaskModal.jsx         # Modal to create new task
    │   │   │   ├── CategoryCard.jsx         # Category group card for Overview page
    │   │   │   ├── TaskBadge.jsx            # Category badge (work/personal/study)
    │   │   │   ├── TaskFilter.jsx           # Filter tabs (All/Today/Pending/Completed/Overdue)
    │   │   │   ├── TaskItem.jsx             # Task row with expand, edit, delete
    │   │   │   └── TaskList.jsx             # Renders list of TaskItems
    │   │   ├── ChangePasswordModal.jsx      # Change password form with dark mode
    │   │   └── EditProfileModal.jsx         # Edit display name modal
    │   ├── hooks/
    │   │   └── useTasks.js                  # Task state, CRUD handlers, filters, stats
    │   ├── layout/
    │   │   ├── MainLayout.jsx               # Main layout wrapper
    │   │   └── Sidebar.jsx                  # Navigation sidebar with filters
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   └── (AuthPage.jsx)           # Login + Signup page
    │   │   ├── CompletedPage.jsx            # Completed tasks page
    │   │   ├── Dashboard.jsx                # Stats + today tasks + efficiency donut
    │   │   ├── Overview.jsx                 # Category expandable view
    │   │   ├── Settings.jsx                 # Profile, dark mode, avatar, password
    │   │   └── TaskPage.tsx                 # Task list with search + filter tabs
    │   ├── services/
    │   │   └── TaskService.js               # All API fetch calls (tasks + auth)
    │   ├── utils/
    │   │   └── cropImage.js                 # Canvas crop utility for react-easy-crop
    │   ├── App.css
    │   ├── App.jsx                          # Root — auth lifecycle, dark mode, screen routing
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
    └── vite.config.js                       # Vite proxy for /api and /uploads
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd TaskFlow
```

### 2. Backend setup
```bash
cd backend
npm install
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

> Both servers must be running at the same time in separate terminals.

---

## 🔧 Vite Proxy (`vite.config.js`)

The Vite dev server proxies requests to the backend so cookies work on the same origin:

```js
server: {
  proxy: {
    "/api": { target: "http://localhost:5000", changeOrigin: true },
    "/uploads": { target: "http://localhost:5000", changeOrigin: true }
  }
}
```

All frontend fetch calls use relative paths like `/api/tasks` instead of `http://localhost:5000/api/tasks`.

---

## 🗄️ Database Schema

**`users` table**
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key, auto-increment |
| name | TEXT | Required |
| email | TEXT | Unique |
| password | TEXT | Bcrypt hashed |
| avatar | TEXT | Path to uploaded image e.g. `/uploads/file.jpg` |
| created_at | TEXT | Default: current timestamp |

**`tasks` table**
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key, auto-increment |
| user_id | INTEGER | Foreign key → users.id (CASCADE delete) |
| title | TEXT | Required |
| description | TEXT | Optional |
| category | TEXT | `work` / `personal` / `study` |
| priority | TEXT | `high` / `medium` / `low` |
| due_date | TEXT | Format: `YYYY-MM-DD` |
| due_time | TEXT | Format: `HH:MM` — optional |
| is_done | INTEGER | `0` = pending, `1` = done |
| created_at | TEXT | Default: current timestamp |

> Migrations run automatically on server start. Missing columns (`avatar`, `due_time`) are added safely via try/catch `ALTER TABLE`.

---

## 🔐 Authentication Flow

1. User signs up or logs in → server signs a JWT → sets it as an `httpOnly` cookie
2. On every page load, `App.jsx` calls `GET /api/auth/me` with `credentials: "include"`
3. Server reads the cookie, verifies the JWT, and returns the user object
4. If valid → user state is set → dashboard is shown
5. If invalid/expired → user state is `null` → `AuthPage` is shown
6. On logout → cookie is cleared → user state reset → redirect to login

`activeScreen` is persisted in `localStorage` so the user returns to the same page after a refresh.

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/signup` | No | Register new user, sets cookie |
| POST | `/login` | No | Login, sets JWT cookie |
| GET | `/me` | Cookie | Returns current user |
| POST | `/logout` | No | Clears auth cookie |
| POST | `/change-name` | Cookie | Update display name |
| POST | `/change-password` | Cookie | Change password (requires current password) |
| POST | `/upload-avatar` | Cookie | Upload profile photo (multipart/form-data) |

### Task Routes — `/api/tasks`

All routes require valid JWT cookie via `authMiddleware`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for current user |
| GET | `/api/tasks?status=overdue` | Get only overdue tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task fields |
| PATCH | `/api/tasks/:id/done` | Toggle `is_done` |
| DELETE | `/api/tasks/:id` | Delete task |

---

## ✨ Features

### Task Management
- Create, edit, delete tasks
- Toggle task completion with checkbox
- Expandable task row showing description, due date/time, edit/delete actions
- Optional due time shown in 12hr AM/PM format with Clock icon
- Past dates blocked — only today or future dates allowed when creating/editing

### Filters & Search
- Search tasks by title
- Filter tabs: **All, Today, Pending, Completed, Overdue**
- Category filters: **work, personal, study** (via Sidebar)
- Today filter shows both pending and completed tasks due today
- Timezone-safe date comparison using `toLocaleDateString('en-CA')` (fixes IST/UTC offset issues)

### Dashboard
- Stat cards: Total Tasks, Due Today, Completed, Overdue
- Upcoming Today list (pending tasks due today, max 5 shown)
- Efficiency donut chart showing completion percentage

### Settings
- Edit display name
- Upload and crop profile photo (react-easy-crop with zoom slider)
- Change password with current password verification
- Dark / Light mode toggle — persists in `localStorage`
- Notifications toggle (UI only)

### Dark Mode
- Global state lives in `App.jsx` — starts as light mode by default
- Adds/removes `dark` class on `<html>` for Tailwind dark mode support
- `darkMode` prop passed down to every component
- Persists across sessions via `localStorage`

---

## 🐛 Known Issues & Notes

- JWT secret is hardcoded as `"mysecretkey"` — move to `.env` before deploying
- SQLite `DATE('now')` in the overdue query uses UTC. The frontend filter uses `toLocaleDateString('en-CA')` to handle IST and other non-UTC timezones correctly
- Avatar images are stored in `/backend/uploads/` — add this folder to `.gitignore`
- No pagination — all user tasks are loaded in a single query

---

## 📦 Key Dependencies

### Frontend (`frontend/package.json`)
```
react
react-dom
vite
tailwindcss
postcss
autoprefixer
lucide-react
react-easy-crop
typescript
```

### Backend (`backend/package.json`)
```
express
sqlite
sqlite3
jsonwebtoken
bcrypt
multer
cookie-parser
cors
```

---


