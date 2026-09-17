# QR Management System

A full-stack student management system with role-based access: admins manage
courses, grades, assignments (with PDF uploads), and attendance, while
students log in (or scan their personal QR code) to view their own academic
record instantly.

## Features

- **Role-based accounts** — Admin and Student roles with real backend
  authorization (JWT + route-level middleware, not just hidden UI buttons)
- **Admin dashboard** — add students, generate unique QR codes per student,
  search/filter, download or print QR codes
- **Per-student academic record** — courses, grades (with chart), attendance
  (with chart), and assignments
- **PDF assignment uploads** — admins can attach a PDF to any assignment;
  students can view/download it
- **QR-code scanning** — visiting a student's QR code URL (with or without
  logging in) shows a read-only view of their profile
- **Student self-service** — students log in and see only their own record
  via a dedicated profile page
- **Secure auth** — passwords hashed with bcrypt, JWT-based sessions, admin
  signups gated behind an admin code

## Tech Stack

- **Frontend:** React, React Router, Chart.js (via react-chartjs-2)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcryptjs
- **File uploads:** Multer (PDF assignment attachments)
- **QR codes:** qrcode.react (frontend generation), qrcode (backend)

## Project Structure

```
├── controllers/       # Express route handlers (auth, students)
├── middleware/         # auth (JWT/role checks), upload (multer/PDF), encrypt
├── models/              # Mongoose schemas (User, Student)
├── routes/              # Express routes
├── uploads/assignments/ # Uploaded PDF files (not committed, see .gitignore)
├── public/              # CRA static assets
├── src/                  # React frontend source
│   ├── components/       # Login, SignUp, Dashboard (NavBar, StudentList, AddStudentForm)
│   └── pages/             # DashboardPage, StudentDetailPage, MyProfilePage
├── db.js                # MongoDB connection
├── index.js             # Express server entry point
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally
  (or a MongoDB Atlas connection string)

### Setup
1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/Shivamcs536/QR-Management-System.git
   cd QR-Management-System
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust values if needed:
   ```bash
   cp .env.example .env
   ```
3. Make sure MongoDB is running locally on `mongodb://localhost:27017`
   (or update `MONGODB_URI` in `.env`).

### Running
Run backend and frontend together:
```bash
npm run dev
```
Or separately in two terminals:
```bash
npm run server   # backend on http://localhost:5000
npm start        # frontend on http://localhost:3000
```
Then open **http://localhost:3000**.

### Using the app
1. Sign up as **Admin** using the admin code set in `.env` (`ADMIN_SIGNUP_CODE`,
   defaults to `admin123` for local dev — change this).
2. Log in, add a student from the dashboard (a unique group/roll number is
   required — this doubles as their student ID). This generates their QR code.
3. Open that student's detail page to add courses, grades, assignments
   (optionally with a PDF attached), and attendance.
4. A student can sign up with the **Student** role using the same group/roll
   number to link their account, then log in to see their own record — or
   simply scan their QR code to view it without logging in.

## Environment Variables
See `.env.example` for all required variables:
- `SERVER_PORT` — backend port (default 5000)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign auth tokens
- `ADMIN_SIGNUP_CODE` — shared code required to sign up as an admin
- `FRONTEND_URL` — used to build the QR code URLs
- `REACT_APP_API_URL` — the frontend's target for API calls

## Notes on File Uploads
Uploaded assignment PDFs are stored on disk in `uploads/assignments/` and
served statically at `/uploads/assignments/<filename>`. This folder is
excluded from git (only a `.gitkeep` placeholder is committed) since uploaded
files shouldn't live in source control.

## License
MIT
