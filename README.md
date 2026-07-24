# AMDOX AI-Powered Cloud ERP Suite

AMDOX ERP is an enterprise-grade, multi-tenant cloud ERP platform featuring high-contrast **Monochrome (Black & White)** aesthetics, dynamic client-server data synchronization, immutable audit trails, and predictive machine learning capabilities.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Next.js Client App] -- Client API Route Proxy --> Proxy[Next.js API Handler]
    Proxy -- Fetch Forwarding --> Gateway[NestJS Gateway API]
    Gateway -- Prisma ORM --> Postgres[(PostgreSQL + TimescaleDB)]
    Gateway -- JWT Verification / RBAC --> Auth[Auth Module]
    Gateway -- Cache / Throttling --> Redis[(Redis Cache & Rate Limiter)]
    Gateway -- HTTP Request / REST --> AIService[FastAPI Predictive Engine]
    
    subgraph FastAPI AI Engine
        LSTM[PyTorch LSTM Forecasting]
        IForest[Isolation Forest Anomaly Check]
    end
```

---

## 🗄️ Database Entity-Relationship (ER) Diagram

The system database layer is powered by PostgreSQL. Below is the relational mapping of the database entities:

```mermaid
erDiagram
    Tenant ||--o{ Organization : "contains"
    Tenant ||--o{ User : "manages"
    Tenant ||--o{ Account : "owns"
    Tenant ||--o{ Employee : "employs"
    Tenant ||--o{ Vendor : "onboards"
    Tenant ||--o{ Warehouse : "operates"
    Tenant ||--o{ Project : "funds"
    Tenant ||--o{ Dashboard : "builds"
    Tenant ||--o{ AuditLog : "records"
    Tenant ||--o{ Invoice : "bills"
    Tenant ||--o{ Payslip : "runs"
    
    Organization ||--o{ Employee : "deploys"
    Organization ||--o{ Project : "supervises"
    
    Account ||--o{ JournalLine : "details"
    JournalEntry ||--o{ JournalLine : "aggregates"
    
    Employee ||--o{ LeaveRequest : "submits"
    Employee ||--o{ Attendance : "logs"
    Employee ||--o{ Payslip : "receives"
    
    Vendor ||--o{ Invoice : "issues"
    Vendor ||--o{ PurchaseOrder : "receives"
    
    Warehouse ||--o{ Stock : "holds"
    Item ||--o{ Stock : "tracks"
    Item ||--o{ StockTransaction : "logs"
    
    Project ||--o{ Task : "plans"
    Project ||--o{ Milestone : "tracks"
    Project ||--o{ ResourceAllocation : "allocates"
    
    Dashboard ||--o{ Widget : "displays"
```

---

## ✨ Features Checklist & Integration

1. **Client-Server Integration**: All frontend Next.js pages fetch dynamically from local API proxy routes, which forward headers (including tenant isolation context `x-tenant-id`) and request payloads to NestJS.
2. **Native Authentication (RBAC & JWT)**: Full token-based login (`POST /api/auth/login`) and token refresh strategy checks user database credentials and generates signed payloads containing role groups and client scope permissions.
3. **Redis Caching & Throttling**: A global rate-limiting guard checks caller IP keys against Redis storage, gracefully failing open if the local container is down to ensure platform availability.
4. **Predictive AI Forecaster**: Integrates demand forecasts (LSTM/Prophet simulation) and fraud checks (Isolation Forest outlier detection) from the FastAPI Python microservice.
5. **Immutable Auditing**: Custom HTTP interceptor logs modifications (`POST`, `PUT`, `DELETE`) and logins to the `AuditLog` table.
6. **Report Generation**: Native CSV export routes generate reports for ledgers, invoices, and payroll runs dynamically.
7. **Production Reliability**: Global filters catch all runtime HTTP exceptions to return standardized JSON API payloads.

---

## 🛠️ Software Bill of Materials (SBOM)

### Frontend Core
- **Next.js v16.2.4** (App Router & Server Component contexts)
- **Tailwind CSS v4** & PostCSS configuration
- **TanStack React Query v5** (state syncing & mutations)
- **Framer Motion v12** (micro-animations & transitions)
- **Recharts v3** (high-contrast charts)
- **Zustand v5** (auth & UI session stores)

### Backend Gateway
- **NestJS v11.0.0** (TypeScript modular monolith)
- **Prisma Client v5.22.0** (database client generation)
- **Passport JWT** & NestJS JWT (claims validation)
- **Swagger OpenAPI v8** (REST route documentation)

### AI Service
- **FastAPI** & Uvicorn
- **PyTorch** & Scikit-learn (LSTM / Isolation Forest)
- **Prophet** (time-series trend analysis)

---

## 🚀 Step-by-Step Developer Setup

### 1. Launch Container Infrastructure
To spin up TimescaleDB, Redis, Elasticsearch, and Keycloak:
```bash
docker-compose up -d
```
*Note: Ensure Docker Desktop is active on your machine.*

### 2. Configure Environment variables
Create a `.env` file under the `backend/` directory:
```env
DATABASE_URL="postgresql://amdox_admin:amdox_password@localhost:5432/amdox_erp?schema=public"
JWT_SECRET="amdox-super-secret-jwt-key"
REDIS_HOST="localhost"
REDIS_PORT=6379
AI_SERVICE_URL="http://localhost:8000"
```

### 3. Sync Database Tables & Seed data
Generate the Prisma Client and load seed organizations/charts of accounts:
```bash
cd backend
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 4. Run the NestJS Backend
```bash
npm run dev
```
*Hosts Swagger REST documentation on `http://localhost:3000/api/docs`.*

### 5. Run the Python AI Engine
```bash
cd ai-service
pip install -r requirements.txt
python app/main.py
```
*Exposes prediction endpoints on `http://localhost:8000`.*

### 6. Run the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*Access the Monochrome Executive Portal at `http://localhost:3000`.*

### 7. Run the Standalone AI Assistant
The AI Assistant operates as an isolated, distinct ecosystem integrating with ERP APIs.
```bash
cd amdox-ai-assistant
docker-compose up -d --build
```
*Access the separate conversational assistant interface at `http://localhost:3050`.*

---

## 📖 API Documentation (Swagger)

Once the backend is started, open **`http://localhost:3000/api/docs`** to test:
- **`POST /api/auth/login`**: Authenticate using your email (e.g. `alex.sterling@amdox.corp`).
- **`GET /api/finance/ledger/export`**: Export financial sheets as CSV files.
- **`POST /api/bi/ai/forecast`**: Predict regional demand.
- **`GET /api/health`**: Automated health check for Kubernetes readiness probes.
