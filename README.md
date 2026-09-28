# CivicFix — Crowdsourced Civic Issue Tracker

A full-stack **MERN** (MongoDB, Express, React, Node.js) application that lets citizens report local civic issues — potholes, broken streetlights, garbage, waterlogging, etc. — by pinning them on a map. The community can upvote issues to signal priority, and admins can track and resolve them through a dashboard with analytics.

Built as a portfolio project to demonstrate: JWT authentication & role-based access, MongoDB **geospatial queries** (2dsphere index, `$near`), file uploads, real map interaction (Leaflet), and data visualization (Recharts).

---

## Features

- 🔐 **Auth** — JWT-based register/login, citizen & admin roles
- 🗺️ **Interactive map reporting** — click anywhere on the map to pin an issue's exact location
- 📍 **"Near me" search** — uses MongoDB's `2dsphere` index + `$near` to find issues within a radius of the user's live location
- 📸 **Photo uploads** — attach an image to a report (Multer, stored locally)
- 👍 **Upvoting** — community signals which issues matter most
- 💬 **Comments** — updates/discussion thread per issue
- 🛠️ **Admin dashboard** — status updates (pending → in-progress → resolved) + charts (issues by category / status) via Recharts
- 🎨 Custom-designed UI (Tailwind CSS, no default template look)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, React-Leaflet, Recharts, Axios |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose (geospatial `2dsphere` index) |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| File uploads | Multer |

---

## Project Structure

```
civic-issue-tracker/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/                # User.js, Issue.js (Mongoose schemas)
│   ├── middleware/            # auth.js (JWT), upload.js (Multer)
│   ├── routes/                 # authRoutes.js, issueRoutes.js
│   ├── uploads/                 # uploaded issue photos (served statically)
│   └── server.js                # Express app entry point
└── frontend/
    └── src/
        ├── api/axios.js         # pre-configured Axios instance
        ├── context/AuthContext.jsx
        ├── components/          # Navbar, MapView, IssueCard, ProtectedRoute
        └── pages/                 # Home, Login, Register, ReportIssue, IssueDetail, AdminDashboard
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your `MONGO_URI` and a strong `JWT_SECRET`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/civicfix
JWT_SECRET=some_long_random_string
CLIENT_URL=http://localhost:5173
```

Run the server:

```bash
npm run dev
```

The API will start on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will start on `http://localhost:5173`.

### 3. Create an admin user

By default every new signup is a `citizen`. To promote a user to `admin` so you can access `/admin`, open Mongo shell (or Compass) and run:

```js
db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } })
```

---

## API Reference (summary)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Log in, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/issues` | — | List issues (filters: `category`, `status`, or `lng`/`lat`/`radius` for near-me) |
| POST | `/api/issues` | ✅ | Report a new issue (multipart form, field `image` optional) |
| GET | `/api/issues/:id` | — | Get single issue |
| PUT | `/api/issues/:id/upvote` | ✅ | Toggle upvote |
| POST | `/api/issues/:id/comments` | ✅ | Add a comment |
| PUT | `/api/issues/:id/status` | ✅ admin | Update issue status |
| DELETE | `/api/issues/:id` | ✅ owner/admin | Delete an issue |
| GET | `/api/issues/analytics` | ✅ admin | Aggregated counts for dashboard |

---

## Talking Points for Interviews

- **Geospatial queries**: `Issue.location` uses a GeoJSON `Point` with a `2dsphere` index, letting `$near` return issues sorted by distance directly from MongoDB — no manual distance math in application code.
- **Security**: passwords hashed with bcrypt, JWT auth middleware protects mutating routes, role-based middleware (`adminOnly`) gates the dashboard and status changes.
- **Separation of concerns**: routes → middleware → models cleanly split on the backend; reusable `MapView` and `IssueCard` components on the frontend.

## Possible Extensions

- Heatmap layer showing issue density
- Email/SMS notification on status change (Nodemailer/Twilio)
- Cloudinary for persistent image hosting (currently local disk storage)
- Pagination/infinite scroll on the issue list
