# WorkFlow: Global Human Resource Management System (HRMS)

WorkFlow is a mobile-first, role-aware Global HRMS designed for multi-country operations (initially US and India). It is built as a modular monolith using a .NET backend, PostgreSQL database, Next.js/React frontend with Tailwind CSS, and GraphQL.

## Technology Stack

- **Backend**: .NET Core (Modular Monolithic Architecture)
- **Database**: PostgreSQL (Npgsql Entity Framework Provider / migrations)
- **Frontend**: Next.js (React.js) using App Router, Zustand, and Redux Toolkit
- **Styling**: Tailwind CSS
- **API**: GraphQL via HotChocolate (.NET) and Apollo Client (Next.js)

---

## Directory Structure

```text
PropVivo/
├── Backend/                 # ASP.NET Core Modular Monolith
│   ├── API/HRMS.API/        # Main API Host Startup
│   ├── Modules/             # HRMS Features (TodoFeature, EmployeeFeature, etc.)
│   └── Shared/              # Shared Application/Infrastructure projects
├── Frontend/                # Next.js App Router Web Application
│   ├── app/                 # Routes and Views
│   ├── components/          # Reusable UI Components
│   └── graphql/             # GraphQL Queries/Mutations definitions
├── docs/                    # Technical & Walkthrough Documentation
│   └── part-reports/        # Part-by-part reports & interview guides
└── README.md                # Root setup instructions
```

---

## Setup and Run Instructions

### 1. Prerequisites
- [.NET SDK 8.0 or 10.0](https://dotnet.microsoft.com/download)
- [Node.js (v18+)](https://nodejs.org/)
- [PostgreSQL Database Server](https://www.postgresql.org/)

### 2. Database Setup
Create a PostgreSQL database named `workflow_db` or configure the connection string in the backend.

### 3. Running the Backend API
1. Open a terminal and navigate to the `Backend/API/HRMS.API` directory.
2. Configure the database connection string in `appsettings.json`.
3. Run the following commands:
   ```bash
   dotnet restore
   dotnet run
   ```
4. The API server will start (usually on `https://localhost:7136` or `http://localhost:5147`). You can verify by visiting `/graphql` in your browser.

### 4. Running the Frontend App
1. Open a terminal and navigate to the `Frontend/` directory.
2. Create your `.env.local` file by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
3. Configure the GraphQL endpoint in `.env.local` to point to the backend API URL.
4. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
