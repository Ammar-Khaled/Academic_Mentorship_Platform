# Academic Mentorship & Code Review Platform

An enterprise-grade, role-based mentorship and scheduling system designed for technical learning environments. The platform allows **Students (Junior Developers)** to discover **Mentors (Technical Experts)**, book 45-minute code review/mock interview sessions, and receive structured feedback. **Mentors** can manage their weekly availability slots and evaluate submissions, while **Administrators** oversee platform users, verify mentors, and manage technical categories.

---

## Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** TailwindCSS v4
- **UI Components:** shadcn/ui & Radix UI
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query & Axios
- **Routing:** React Router v7 (Role-based access control)
- **Internationalization:** i18next (supports LTR/RTL for Arabic fields)

### Backend
- **Framework:** NestJS (TypeScript)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with Passport strategy
- **Validation:** Class-validator & Class-transformer

---

## Prerequisites

Before starting, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port `27017` or a MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

## Quick Start & Installation

Follow these simple steps to get the application running locally.

### 1. Clone the Repository
```bash
git clone https://github.com/Ammar-Khaled/Academic_Mentorship_Platform.git
cd Academic_Mentorship_Platform
```

---

### 2. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and update it if necessary:
   ```bash
   cp .env.example .env
   ```
   *Default `.env` configuration:*
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/academic_mentorship
   JWT_SECRET=jwt_secret
   JWT_EXPIRES_IN=1d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Seed the Database (Optional but Recommended):**
   Populate the database with initial admin, mentor, student accounts, and technical stacks:
   ```bash
   # Normal seeding
   npm run seed
   
   # Fresh seeding (clears existing database collections first)
   npm run seed:fresh
   ```

5. **Start the Backend Server:**
   ```bash
   # Run in development mode with hot-reload
   npm run start:dev
   ```
   The backend API will be available at: `http://localhost:3000/api`

---

### 3. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *Default `.env` configuration:*
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:5173`

---

## Default Seeded Accounts

If you ran the seed script (`npm run seed:fresh`), you can log in using the following credentials:

| Role | Email | Password |
| --- | --- | --- |
| **Admin** | `admin@platform.com` | `Admin@123` |
| **Mentor** | `mentor@platform.com` | `Mentor@123` |
| **Student** | `student@platform.com` | `Student@123` |

---

## API Reference

The backend exposes the following REST API endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user (Student or Mentor).
- `POST /api/auth/login` - Login to obtain a JWT access token.
- `GET /api/auth/profile` - Retrieve the currently authenticated user's profile.

### Mentors & Availability
- `GET /api/mentors?stack={id}&sort_by={rating}&keyword={term}&page={page}` - Search and filter mentors.
- `GET /api/mentors/{id}/availability?date=YYYY-MM-DD` - Retrieve available 45-minute slots for a mentor.

### Review Sessions
- `POST /api/sessions/book` - Book a 45-minute mentorship session (Requires Student Auth).
- `GET /api/sessions` - Retrieve booked sessions for the authenticated user.
- `PUT /api/sessions/{id}/status` - Update session status or add evaluations/feedback (Requires Mentor/Admin Auth).
- `GET /api/sessions/{id}/audit` - Fetch AI audit/classification logs for a session.

### Admin Actions
- `GET /api/admin/users` - List all registered users.
- `PUT /api/admin/users/{id}/status` - Approve or block a user (e.g., verify mentors).
- `POST /api/stacks` - Create a new technical stack/category.
- `DELETE /api/stacks/{id}` - Remove a technical stack/category.

---

## 📁 Project Structure

```text
Academic_Mentorship_Platform/
├── backend/                # NestJS Backend
│   ├── src/                # Application modules, controllers, services, schemas
│   ├── scripts/            # Database seeding scripts
│   ├── test/               # Unit and E2E tests
│   └── package.json
├── frontend/               # React + Vite Frontend
│   ├── src/                # Components, hooks, routes, contexts, assets
│   ├── public/             # Static public assets
│   └── package.json
├── BRD.md                  # Business Requirements Document
└── README.md               # Root Project Documentation
```
