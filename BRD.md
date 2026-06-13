# Academic Mentorship & Code Review Platform

## Frontend Specification

**React Project** | ⏰ **Deadline:** 7 days
**Tech Stack:** React + Backend (Django / FastAPI / Laravel / NestJS / Express.js) + UI Component Library

### Project Overview

The application is a role-based mentorship and scheduling system designed for technical learning environments. Junior developers (Students) browse technical experts (Mentors) to book 45-minute code review sessions, pair programming evaluations, or mock interviews. Mentors manage their weekly availability slots and evaluate submissions, while administrators oversee platform integrity, configurations, and technical category expansions.

* **UI Framework & Constraints:** You must construct the entire user interface utilizing Material UI, shadcn/ui, or TailwindCSS. Bootstrap is strictly prohibited.
* **Routing:** All navigation configurations must utilize dynamic role-based routing through React Router.

---

### Required Pages

Develop a single-page application containing the following routes, structured safely with comprehensive 404 error-catching parameters:

* **Mentor Search / Discovery:** Main landing view with functional tech-stack and keyword filters.
* **Mentor Profile & Session Booking:** View specialized skill matrices, open scheduling segments, and book slots.
* **Student Dashboard:** Track booked reviews, cancel incoming slots, view text evaluations/feedback, or update profile.
* **Mentor Dashboard:** Establish operating availability parameters, monitor pending reviews, and append evaluation notes.
* **Admin Dashboard:** Moderate user access, approve/block mentor requests, and scale technical system categories.
* **Login:** Unified authentication engine covering all security access levels.
* **Register:** Onboarding portal with role segregation options for Students and Mentors.
* **Profile Customization:** Contextual workspace to adjust operational technical profiles.
* **404 Not Found:** Catch-all visual wrapper intercepting non-existent endpoints.

---

### Suggested Work Division

**1. Data & Auth Lead**

* JWT secure token extraction.
* Login & Register view bindings.
* Global context definitions (Redux Toolkit/Zustand).
* Role-Based Access Control filters.

**2. Student UX Lead**

* Mentor discovery & stack processing.
* Session reservation state controls.
* Real-time block overlap validation.
* Search pagination pipelines.

**3. Mentor & Admin Lead**

* Availability structural configurations.
* Moderation view data matrices.
* CRUD systems for technical stacks.
* Route code-splitting (Lazy Loading).

**4. UI/UX Lead**

* Component library style overrides.
* Dark mode switch engines.
* i18n translation maps (LTR/RTL).
* Feedback toasts & loading skeletons.

---

### Core Functional Requirements

**1. Student Capabilities (API & UI)**

* **Discovery Engine:** Browse an optimized index of technical mentors equipped with functional sorting filters for specific programming stacks and developer titles.
* **Session Reservation:** Interrogate a mentor's open schedule parameters and safely secure an isolated 45-minute code evaluation slot.
* **Session Management:** Monitor historical, current, or pending sessions from a tailored workspace. Support full capabilities to cancel, shift, or review evaluations.
* **Concurrency Protection:** Implement bulletproof client-side and structural checks ensuring no two students can successfully book the exact same mentor inside the same time interval.
* **Sorting Metrics:** Arrange active mentors using specialized query configurations tracking rating systems, price matrices, or current availability (e.g., `sort_by=rating`).
* **Roster Pagination:** Dynamically page large indices of matching mentors and structural administration tables via active URL modifications (e.g., `page=3`).
* **Search Input Debouncing:** Force a deliberate processing interval (e.g., 500ms delay) upon the discovery input interface to safely govern backend API call rates.

**2. Mentor & Admin Capabilities (State & Routing)**

* **Availability Matrix:** Empowers technical mentors to define their operating weekly schedule thresholds (specifying exact active dates, hours, and days).
* **Evaluation Workspace:** Monitor upcoming review schedules, modify biographical profile matrices, toggle slot approval status, and explicitly append code evaluation notes.
* **User Moderation Core:** Provides administrators structural authority to inspect user lists, approve incoming technical mentor applications, or block non-compliant accounts.
* **Configuration Control (CRUD):** Allow administrative accounts to dynamically construct, read, update, and delete configuration files and target system categories (e.g., adding "System Design"), and monitor sessions system-wide.

**3. UI Enhancements & Auth (UI Components)**

* **Component Implementation:** Explicitly style interfaces utilizing clean library elements. Absolute avoidance of standard default styles or illegal frameworks is required.
* **Secure Session Extraction:** Conduct reliable authorization and user session maintenance using JSON Web Tokens (JWT).
* **Data Stream Control:** Govern complex form interactions, client validations, and overarching state variables safely through Context API or Redux Toolkit.
* **Interface Upgrades:** Build highly responsive interface components including dynamic, contextual document tab title indicators alongside structured Back to Top mechanics.
* **User Toast Notifications:** Deliver immediate visual system confirmations or clean error updates using high-quality notification packages following key state mutations.
* **Skeletons & Fallbacks:** Generate explicit library Skeleton wrappers to mask background network lookups. Deploy clean, illustrative empty-state containers if active list indicators fall to zero.

**4. Architecture & Best Practices**

* **Role-Based Route Execution:** Intercept and partition insecure access using strict React Router structural guards to isolate workspaces.
* **API Resilience Rules:** Intercept data transaction exceptions at the view or network layer, presenting elegant error context to the client using visual alerts.
* **Theme Swapping:** Implement a system-wide theme context controller executing clean dark/light mode CSS overrides safely.
* **Decoupled Custom Hooks:** Isolate component render tracks from raw network protocols by creating modular hooks or tailored Axios instance engines.
* **i18n Localization:** Establish full structural internationalization capabilities, seamlessly translating interface text nodes and altering layouts to complete Right-to-Left (RTL) rules for Arabic fields.
* **Route Lazy Loading:** Enhance production initialization benchmarks by utilizing `React.lazy()` coupled with `<Suspense>` to separate massive route modules.

---

### Expected Backend API Reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| **POST** | `/api/auth/login` | Login (Obtain JWT via Unified User) |
| **POST** | `/api/auth/register` | Register New User |
| **GET** | `/api/auth/profile` | Profile Data Fetch |
| **GET** | `/api/mentors?stack={id}&sort_by={rating}&keyword={term}&page={page}` | Available Mentors Index |
| **GET** | `/api/mentors/{id}/availability?date=YYYY-MM-DD` | Mentor Availability Blocks |
| **POST** | `/api/sessions/book` | Book Review Session |
| **GET** | `/api/sessions` | User Booked Sessions |
| **PUT** | `/api/sessions/{id}/status` | Update Session Evaluation / Status |
| **GET** | `/api/sessions/{id}/audit` | Fetch Session AI Audit Log |
| **GET** | `/api/admin/users` | Admin: All Platform Users |
| **PUT** | `/api/admin/users/{id}/status` | Admin: Approve/Block User Status |
| **POST** | `/api/stacks` | Admin: Create Technical Stack |
| **DEL** | `/api/stacks/{id}` | Admin: Remove Technical Stack |

---

### Delivery Submission Guidelines

**1. Timeline & Estimate**
Provide an estimate sheet with features, initial estimates, and actual spent time using the provided Google Sheet link. Maximum of 7 days to complete and submit.

**2. Version Control & Hosting**
Link project with GitHub, pushing commits per feature. Deliver the GitHub link, add `hassaneldash` to the repository, and host using Cloudflare, Vercel, Netlify, or GitHub Pages (provide the live link).

**3. Final Submission**
Send everything to `hassanmeldash@gmail.com` with the Email subject: *ITI Zagazig | OS46 | React Project | Mentorship App | Group No.?*
Record a comprehensive video walkthrough detailing your entire application. Grading evaluates functional completeness, structural code quality, and consistent commit history.

**Developer Checklist & Tips**

* **Component Reusability:** Create reusable React components for profile cards and list items.
* **Debounce API Calls:** Don't spam the backend API. Ensure your debounce hook works before testing mentor discovery.
* **Graceful Loading:** Implement UI Skeletons early so the interface never looks broken during network requests.
* **Project Structure:** Maintain clear separation of Custom Hooks for Axios, Global States for Auth, and UI components.

---

## Backend Specification

**Multi-Framework Project** | Data Infrastructure, Relational Design, and API Engineering

### Part 1: The Scenario

**The Problem Story**
Backend systems govern data pipelines, protect integrity rules, and expose secure communication endpoints. The ecosystem relies on specialized **Stacks** (Tech Categories) like "React Engineering" or "System Design". Every Stack is tracked with a unique identity and description.

**Mentors** are technical experts assigned to exactly one primary technical Stack. Their profile captures their full name, bio, and verification status. **Students** are junior developers; the system logs their registration name, date of profile creation, and contact flags.

The core transaction is managing **Review Sessions**. Sessions explicitly log the targeted date, time, the student's submission description, and the operational status ('Scheduled', 'Completed', or 'Canceled'). A Session strictly links one Mentor and one Student.

**The Real-World System Bottleneck**
The platform requires automated auditing. When scheduled, the backend must pass the text submission description directly to a code classification pipeline. The evaluation engine returns a **Session Audit Log** (auto-generated technical tag and prediction confidence metric) which must be safely preserved and linked to the session.

---

### Part 2: Ecosystem Capabilities

**Zero-Assumption System Rules**

* Administrators can perform standard CRUD operations on Stacks, global settings, and monitor Mentor verification flags.
* The system supports Student and Mentor sign-ups, exposing unified JWT tokens.
* Users can query active Mentors with pagination, keyword searches, and stack sorting.
* Students can book 45-minute consultation slots calculated dynamically.
* The backend automatically intercepts valid bookings, passes text to an evaluation helper, and preserves a Session Audit Log.

**Structural Constraints**

* Data persistence must run strictly via relational SQL rules to eliminate orphan records.
* Data integrity rules (Foreign Keys and Cascade protections) must be implemented.
* **Concurrency Verification:** Bookings must run through a transaction with strict isolation logic to mathematically prevent timeline overlaps.
* **Transactional Atomicity:** If the Session Audit Log fails to instantiate, the Review Session must rollback cleanly.

---

### Part 3: Database Architecture

| Entity (Table) | Attributes (Columns) | Description / Integrity Rule |
| --- | --- | --- |
| **User** | id [PK], email (Unique), password_hash, role (Admin/Mentor/Student), created_at | Central identity store handling unified JWT authentication and strict RBAC. |
| **Stack** | id [PK], name (Unique), description | Technical domains (e.g., Python Systems). |
| **MentorProfile** | id [PK], user_id (FK/Unique), stack_id (FK), name, title, bio, is_verified (bool), average_rating (float), hourly_rate (decimal) | Expert profile tied 1:1 to a User. Includes admin verification and sorting metrics. |
| **MentorAvailability** | id [PK], mentor_id (FK), day_of_week, start_time, end_time | Weekly operating windows used to dynamically compute unbooked 45-minute blocks. |
| **StudentProfile** | id [PK], user_id (FK/Unique), name | Junior developer profile tied 1:1 to a User. |
| **ReviewSession** | id [PK], mentor_id (FK), student_id (FK), start_time, end_time, description, status (Scheduled/Completed/Canceled) | Central transaction evaluated under isolation rules to prevent timeline overlaps. |
| **SessionAuditLog** | id [PK], session_id (FK/Unique), predicted_tag, confidence_score (float), status (SUCCESS/FAILED), error_message, latency_ms | Preserves external execution telemetry metadata. |

---

### Part 4: Cardinality & Participation Mapping

* **Stack to Mentor (1:N):** One Stack houses many Mentors. A Mentor belongs to exactly one Stack. Participation is Total on the Mentor side.
* **Mentor to ReviewSession (1:N):** One Mentor hosts many Review Sessions. A Session has one assigned Mentor. Participation is Total on the Session side.
* **Student to ReviewSession (1:N):** One Student requests many Review Sessions. Participation is Total on the Session side.
* **ReviewSession to SessionAuditLog (1:1 Case B):** One Review Session maps exactly one Audit Log. Participation is Partial on the Session side and Total on the Audit Log side.

---

### Part 5: Framework Execution Blueprints

*Choose ONE of the following infrastructure stacks:*

**Option A: Django REST Framework (Python)**

* Use `uv` to spin up environment files, installing `django`, `djangorestframework`, `djangorestframework-simplejwt`, and `pillow`.
* Isolate logic into an app folder and expose API serialization via `serializers.py`.

**Option B: FastAPI (Python)**

* Build an enterprise directory pattern utilizing `routers/`, `models/`, and `schemas/`.
* Utilize SQLAlchemy or SQLModel. Enforce dependency injection for authentication.

**Option B: Laravel (PHP)**

* Initialize migrations using standard `artisan` CLI commands.
* Isolate business logic within `Controllers/` and `Requests/`. Utilize Sanctum or Passport for JWT.

**Option D: NestJS (TypeScript)**

* Create independent modules using standard nesting structure.
* Leverage TypeORM or Prisma. Protect routes via Guard controllers executing JWT Passport validation.

**Option E: Express.js (JavaScript / Node)**

* Build a modular directory pattern manually (`controllers/`, `routes/`, `models/`).
* Utilize Sequelize or Mongoose/Prisma. Enforce authentication via custom middleware.

---

### Part 6: API Protection & Integration

**Security Levels**

* **Environment Variables Encapsulation:** All database passwords and tokens must live inside a root-level `.env` file (added to `.gitignore`).
* **JWT Token Evaluation:** Restrict booking access. The client must present a valid `Bearer <token>` authorization header.
* **Robust Telemetry Tracking:** Implement secure exception blocks wrapping all external model executions. Intercept errors and log them to preserve service uptime.

**Submission Rule**
Provide a comprehensive, functional collection mapping (Postman or Insomnia JSON). It must verify clean request/response data shapes across all endpoints.

**Developer Guidelines**

* **CORS Policy:** Configure Cross-Origin Resource Sharing (CORS) headers to allow the React frontend to communicate with the backend.
* **Database Validation:** Enforce uniqueness constraints at the engine level for critical text vectors (like emails) to eliminate duplicate data.