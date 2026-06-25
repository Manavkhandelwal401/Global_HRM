# WorkFlow HRMS: Part 0 - Project Foundation & Rules Lock Report

This report outlines the structural preparation, tech stack verification, and directory organization for the WorkFlow Global HRMS.

---

## 1. Assignment Requirements & Tech Stack

The assessment requires building a mobile-first Global HRMS application with the following locked-in technical stack:
- **Backend:** .NET Core API (Modular Monolithic Architecture)
- **Database:** PostgreSQL
- **Frontend:** Next.js / React.js
- **Styling:** Tailwind CSS
- **API Protocol:** GraphQL (HotChocolate on backend, Apollo Client on frontend)

---

## 2. Boilerplate & Architectural Review

We are provided with two starting boilerplates:
1. **Backend Modular Monolith:** Includes structured layers under `Modules/TodoFeature` and shared utilities in `Shared/`. Features are encapsulated within their own Domain, Application, Infrastructure, and GraphQL layers, reducing cross-module coupling.
2. **Next.js Frontend:** Wires up Apollo Client, Redux Toolkit, Zustand, Context Session management, and basic authentication guards.

**Why the architecture cannot be changed:**
- Consistency: The monolithic modular pattern ensures boundaries are strictly maintained so modules can later be extracted into microservices if needed.
- Grading/Criteria: Replacing or heavily deviating from this boilerplate violates mandatory evaluation criteria.

---

## 3. Directory Layout

The workspace is organized as follows:
- `/Backend` - ASP.NET solution, module features, and shared libraries.
- `/Frontend` - Next.js App Router and UI code.
- `/docs` - Documentation and walkthrough reports.

---

## 4. Connection Flow

- The **Next.js Frontend** runs locally (port `3000`) and calls the **.NET API** (via GraphQL endpoint `/graphql`).
- The **.NET Backend** connects to the **PostgreSQL** database (defined in `appsettings.json` connection strings) using EF Core and initializes the schema automatically at startup.

---

## 5. Interview Guide & Q&A (Hinglish)

### Q1: Modular Monolith kya hota hai aur is project mein iska use kyun ho raha hai?
**Answer:** 
Modular Monolith ek software architecture pattern hai jisme pura application ek single deployable unit (monolith) ki tarah deploy hota hai, lekin internally iske different modules ya features (jaise Leave, Attendance, Employee) completely decoupled aur self-contained hote hain. Iska fayda yeh hota hai ki complexity low rehti hai but boundary clean hone se future mein kisi feature ko microservice mein convert karna easy ho jata hai.

### Q2: GraphQL kyun use kar rahe hain REST ki jagah?
**Answer:**
GraphQL humein exact data fetch karne ki capacity deta hai (no over-fetching/under-fetching). Mobile-first applications ke liye yeh efficiency badhata hai kyunki single round-trip query se client screen par specific columns request kar sakta hai, jo server bandwidth and latency ko minimize karta hai.
