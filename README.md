# Centralized Placement Portal (CPP)

A single, unified platform that brings college students and placement cells (TPO) together —
eliminating scattered updates, layered bureaucracy and preparation gaps, with an AI Copilot
guiding students along corporate hiring pipelines.

**Stack:** React (Vite) · Spring Boot 3 · MySQL · JWT Auth · a rule-based AI Placement Copilot

---

## ✨ Features

### Student Portal
- **One-profile resume builder** — CGPA, backlogs, skills and resume link, logged once.
- **Live job feed** — every open drive, applied straight from the dashboard, with server-side
  eligibility checks (CGPA / backlogs / branch).
- **Application tracker** — a visual pipeline (Applied → Shortlisted → Interview → Selected/Rejected).
- **AI Placement Copilot** — per-company round-by-round breakdown, common questions, prep tips,
  and a predictive **fit-score** that compares your profile against a job's requirements.
- **Professor Desk** — direct 1:1 chat with your assigned TPO.
- **Broadcast inbox** — instant notifications targeted at you by the TPO.

### TPO Admin Portal
- **Dashboard** — registered students, drives posted, applications, offers, with live charts.
- **Post / manage drives** — full eligibility criteria, interview rounds, deadlines.
- **Applications review** — move any candidate through the pipeline with one click.
- **Dynamic Master Ledger** — filter every student instantly by branch / CGPA / backlogs / batch / skill
  (the "Filter for: CGPA > 8.0 AND Skill = Java" feature from the concept doc).
- **One-click broadcast** — reuses the same filter criteria to notify every qualifying student at once.
- **Messages** — reply to any student who's reached out.

---

## 🗂 Project Structure

```
centralized-placement-portal/
├── backend/     Spring Boot REST API (Java 17, Maven)
└── frontend/    React 18 + Vite + Tailwind CSS
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+ and Maven (or use the IDE's built-in Maven)
- Node.js 18+ and npm
- MySQL 8 running locally

### 1. Database
No manual schema setup needed — the backend will create the database and tables for you.
Just make sure MySQL is running.

### 2. Backend

```bash
cd backend
```

Open `src/main/resources/application.properties` and update these two lines to match your
local MySQL credentials:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

Then run:

```bash
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first run it automatically seeds demo data
(see credentials below) — you don't need to create accounts manually to explore the app.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # defaults already point at http://localhost:8080/api
npm run dev
```

The app runs on **http://localhost:5173**.

---

## 🔑 Demo Credentials

Seeded automatically the first time the backend starts:

| Role    | Email             | Password     |
|---------|-------------------|--------------|
| TPO     | tpo@cpp.edu       | Tpo@1234     |
| Student | rahul@cpp.edu     | Student@123  |
| Student | priya@cpp.edu     | Student@123  |
| Student | arjun@cpp.edu     | Student@123  |
| Student | sneha@cpp.edu     | Student@123  |

The login page also has one-click "Demo Student" / "Demo TPO" buttons that fill these in for you.

Demo data includes 5 sample company drives (Wipro, TCS, Google, Accenture, Infosys) with real
eligibility criteria, a handful of applications already moving through the pipeline, a sample
broadcast, and a sample message thread — so every screen has something to look at immediately.

To start with a clean, empty system instead, set `app.seed-demo-data=false` in
`application.properties` before the first run.

---

## 🧠 About the AI Placement Copilot

The Copilot ships as a **transparent, fully offline rule engine** — no API key required, so the
project works immediately after cloning:

- **Interview prep guides** are looked up from a `company_prep_guides` table (seeded for the 5 demo
  companies) and fall back to a sensibly-generated generic 4-round guide for any other company name
  a student searches.
- **Fit score** is a deterministic weighted match between a student's profile (CGPA, backlogs,
  branch, skills) and a job's stated requirements — transparent and explainable, not a black box.

If you'd like to upgrade this to a real generative model (OpenAI, Anthropic, etc.), everything is
isolated behind one interface:

```
backend/src/main/java/com/cpp/placement/service/AiCopilotService.java
backend/src/main/java/com/cpp/placement/service/impl/AiCopilotServiceImpl.java
```

Swap the logic inside `getPrepGuide()` / `getFitScore()` for an API call to your model of choice —
the controller, DTOs and React UI don't need to change at all.

---

## 🔐 Authentication

JWT-based, stateless. On register/login the API returns a signed token which the frontend stores
and attaches as `Authorization: Bearer <token>` on every request. Two roles: `STUDENT` and `TPO`,
enforced both at the URL level (Spring Security) and the method level (`@PreAuthorize`).

**Before deploying anywhere beyond your own machine**, change `app.jwt.secret` in
`application.properties` to a long random string.

---

## 📡 Key API Endpoints

| Method | Endpoint                              | Description                              |
|--------|----------------------------------------|-------------------------------------------|
| POST   | `/api/auth/register`                  | Create a student or TPO account            |
| POST   | `/api/auth/login`                     | Log in, returns a JWT                      |
| GET    | `/api/jobs`                           | List open drives (public)                  |
| POST   | `/api/jobs`                           | Post a drive (TPO)                         |
| POST   | `/api/applications/apply/{jobId}`     | Apply to a drive (Student)                  |
| PATCH  | `/api/applications/{id}/status`       | Move a candidate through the pipeline (TPO) |
| GET    | `/api/ledger?branch=CSE&minCgpa=8.0`  | Dynamic Master Ledger search (TPO)          |
| POST   | `/api/notifications/broadcast`        | One-click targeted broadcast (TPO)          |
| GET    | `/api/ai/prep/{companyName}`          | AI Copilot interview prep guide             |
| GET    | `/api/ai/fit-score/{jobId}`           | AI Copilot predictive fit score (Student)   |

---

## 🎨 Design System

The frontend uses a custom "ledger meets boarding pass" visual language rather than a generic
admin-dashboard theme: a navy/paper/gold/teal palette, Fraunces (display serif) + Inter (body) +
IBM Plex Mono (data/ledger figures), ink-stamp status badges, and job postings styled like
boarding passes with a perforated stub. All tokens live in `frontend/tailwind.config.js` and
`frontend/src/index.css` if you'd like to restyle it.

---

## 🛠 A note on this build

This project was scaffolded end-to-end rather than cloned from an existing repository — a
thorough search did not turn up an existing open-source project matching this exact combination
(placement-portal domain + React/Spring Boot/MySQL + production-quality UI). The frontend was
verified with a clean `npm run build`. The backend follows standard, well-tested Spring Boot
patterns; do a first `mvn spring-boot:run` to confirm it builds cleanly in your own environment.
