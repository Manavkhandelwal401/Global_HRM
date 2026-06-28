# WorkFlow: Global Human Resource Management System (HRMS)

WorkFlow is a mobile-first, role-aware Global HRMS designed for multi-country operations (initially US and India). It is built as a modular Django REST + GraphQL backend, PostgreSQL database, Next.js/React frontend with Tailwind CSS, and Strawberry GraphQL.

## Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.12 + Django 5.0 |
| **API** | Strawberry GraphQL + Django REST Framework |
| **Authentication** | JWT (SimpleJWT) |
| **Database** | PostgreSQL (via django.db.backends.postgresql) |
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS |
| **Deployment** | Google Cloud Run (asia-south1) |
| **Container Registry** | Google Artifact Registry |
| **CI/CD** | Google Cloud Build |

---

## Architecture Overview

```
Client (Browser)
    │
    ▼
Google Cloud Run — Frontend (Next.js)
    │  HTTPS requests
    ▼
Google Cloud Run — Backend (Django/Gunicorn)
    │
    ├── /graphql       — Strawberry GraphQL endpoint
    ├── /api/          — REST API (auth, health)
    └── /health/       — Health check endpoint
    │
    ▼
Cloud SQL — PostgreSQL
```

---

## Directory Structure

```text
Global_HRM/
├── Backend/                       # Python / Django backend
│   ├── api/                       # Django app (models, views, resolvers)
│   │   ├── models.py              # Employee, Leave, Attendance, Payroll, etc.
│   │   ├── schema.py              # Strawberry GraphQL schema
│   │   ├── views.py               # REST views (login, signup, health)
│   │   └── urls.py
│   ├── hrms_backend/              # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── Dockerfile                 # Production Docker image
│   └── requirements.txt
├── Frontend/                      # Next.js App Router Web Application
│   ├── app/                       # Routes and page components
│   ├── components/                # Reusable UI components
│   ├── context/                   # React context (auth, theme, toast)
│   ├── graphql/                   # GraphQL queries & mutations
│   └── middleware.ts              # Route protection middleware
├── cloudbuild.yaml                # Cloud Build CI/CD pipeline
├── docs/                          # Technical documentation
│   └── part-reports/              # Architecture & verification reports
└── README.md
```

---

## User Roles

| Role | Description |
|---|---|
| **Admin** | Full system access, user management, org settings |
| **HR** | Employee management, leave approvals, payroll |
| **Manager** | Team attendance, leave approvals, performance reviews |
| **Employee** | Personal dashboard, leave requests, payroll, expenses |

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@globalhrm.com | Admin@123 |
| HR | hr@globalhrm.com | Hr@12345 |
| Manager | manager@globalhrm.com | Manager@123 |
| Employee | employee@globalhrm.com | Employee@123 |

---

## Setup — Local Development

### Prerequisites
- [Python 3.12](https://www.python.org/downloads/)
- [Node.js v18+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/)

### 1. Clone the repository

```bash
git clone https://github.com/Manavkhandelwal401/Global_HRM.git
cd Global_HRM
```

### 2. Backend Setup

```bash
cd Backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `Backend/` directory:

```env
DB_NAME=globalhrm
DB_USER=postgres
DB_PASS=yourpassword
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key
DEBUG=True
```

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

Backend will be available at `http://localhost:8000`  
GraphQL playground: `http://localhost:8000/graphql`

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
```

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## Production Deployment

The application is deployed on **Google Cloud Run** via **Google Cloud Build**.

- **Frontend**: `https://global-hrm-frontend-230429510558.asia-south1.run.app`
- **Backend**: Deployed as `global-hrm-backend` on Cloud Run (asia-south1)
- **Database**: Google Cloud SQL — PostgreSQL

To trigger a production deployment:

```bash
gcloud builds submit --config cloudbuild.yaml --project=global-hrm-20230625
```

---

## API Reference

### Health Check
```
GET /health/
Response: { "status": "ok", "database": "connected", "graphql": "ready" }
```

### Authentication
```
POST /api/auth/login/     — Login with email + password → returns JWT tokens
POST /api/auth/signup/    — Register employee with activation code
POST /api/auth/refresh/   — Refresh access token
POST /api/auth/logout/    — Invalidate refresh token
```

### GraphQL
```
POST /graphql             — All GraphQL queries and mutations
```

---

## Legacy Code

The `Backend_CSharp/` directory contains the original .NET/HotChocolate/Entity Framework prototype. It is **not used in production** and is kept for historical reference only. All production traffic is served by the Django backend.
