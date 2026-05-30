# AMDOX AI-Powered Cloud ERP Suite

AMDOX ERP is a state-of-the-art, multi-tenant cloud ERP platform built with Next.js 15, NestJS 11, FastAPI, PostgreSQL (TimescaleDB), Redis, Elasticsearch, and Docker/Kubernetes.

This repository contains the complete implementation of the ERP suite, featuring a high-contrast **Monochrome (Black & White)** dashboard theme and fully dynamic client-server data synchronization.

---

## Repository Structure

The monorepo is structured as follows:
- **`frontend/`**: Next.js 15 App Router client app (React 19, TypeScript, Tailwind CSS v4, Zustand, TanStack React Query v5, Recharts).
- **`backend/`**: NestJS 11 modular monolith service (TypeScript, Prisma ORM, PostgreSQL, GraphQL Apollo, REST Swagger).
- **`ai-service/`**: Python 3.13 FastAPI forecasting microservice (PyTorch LSTM, Facebook Prophet, scikit-learn).
- **`devops/`**: Production multi-stage Dockerfiles, Kubernetes deployment configurations, and Terraform IaC scripts.

---

## Completed Implementations

### 1. Dynamic Client-Server APIs
We replaced static arrays in the frontend with active REST API calls using React Query hooks. These connect to dynamic route handlers that read/write from a local JSON database file (`frontend/db.json` managed by `db.ts`):
- **Executive Dashboard** (`/api/dashboard`): Returns randomized live financial statistics, headcount variables, and real-time activity feeds.
- **Accounts Payable (AP)** (`/api/finance/ap`): Supports reading and posting verified vendor bills.
- **Accounts Receivable (AR)** (`/api/finance/ar`): Fulfills invoicing queries and issues new billing requests.
- **HR Employee Directory** (`/api/hr/employees`): Feeds directory tables and handles staff onboarding.
- **HR Payroll Runs** (`/api/hr/payroll`): Computes salaries and calculates flat-tax slab deductions.
- **SCM Vendors** (`/api/supply-chain/vendors`): Onboards suppliers and tracks rating scores.
- **Project Portfolios** (`/api/projects`): Manages project launches and maps progress.

### 2. NestJS 11 Backend Gateways
The backend contains fully structured modules, DTO validations, request-scoped tenant middlewares, and database services:
- **`src/main.ts`**: Enables global pipes, CORS, and hooks up the Swagger OpenAPI UI.
- **`src/app.module.ts`**: Aggregates modules and registers GraphQL Apollo and HTTP controllers.
- **`src/common/tenant.context.ts`**: Intercepts `X-Tenant-ID` headers to support tenant-level Row-Level Security.
- **`src/common/prisma.service.ts`**: Manages connections to PostgreSQL.
- **Domain Controllers**: Written REST mappings for **Finance** (debit/credit journal balancing), **HR** (attendance logging and leave approvals), **SCM** (FIFO stock transactions), **Projects** (timelines & FTE loading), and **BI** (widget dashboard saves).

### 3. AI Predictive Forecasting Service
The Python FastAPI microservice provides real machine learning APIs:
- **Time-Series Forecasts** (`/api/v1/ai/forecast`): Employs a PyTorch LSTM model and a Prophet seasonality estimator to forecast SKU sales.
- **Anomaly Audits** (`/api/v1/ai/detect-anomalies`): Runs a scikit-learn Isolation Forest algorithm to flag unusual expenses or inventory variances.

### 4. Database Schema & Seeding
- **Prisma Schema**: Models relational tables for all corporate modules, complete with soft-deletes (`deletedAt`) and multi-tenant keys: [schema.prisma](file:///C:/Users/ebine/.gemini/antigravity/scratch/amdox-erp/backend/prisma/schema.prisma).
- **Database Seed**: Populates default mock organizations, users, accounts, vendors, and items for development: [seed.js](file:///C:/Users/ebine/.gemini/antigravity/scratch/amdox-erp/backend/prisma/seed.js).

### 5. DevOps & Observability Scripts
- **Dockerizing**: Multi-stage production container profiles for the [frontend](file:///C:/Users/ebine/.gemini/antigravity/scratch/amdox-erp/devops/frontend.Dockerfile), [backend](file:///C:/Users/ebine/.gemini/antigravity/scratch/amdox-erp/devops/backend.Dockerfile), and [AI service](file:///C:/Users/ebine/.gemini/antigravity/scratch/amdox-erp/devops/ai.Dockerfile).
- **Kubernetes Workloads**: ConfigMaps, ClusterServices, and replicas for EKS: [k8s-deployment.yml](file:///C:/Users/ebine/.gemini/antigravity/scratch/amdox-erp/devops/k8s-deployment.yml).
- **Terraform IaC**: Provisions VPC subnets, AWS RDS PostgreSQL instances, ElastiCache Redis clusters, and S3 asset buckets: [main.tf](file:///C:/Users/ebine/.gemini/antigravity/scratch/amdox-erp/devops/main.tf).

---

## How to Run locally

### Prerequisites
- **Node.js 22 LTS** & npm
- **Docker & Compose** (to run postgres, redis, keycloak, elasticsearch)
- **Python 3.13+** (optional for AI model retraining)

### Local Dev Setup

#### 1. Spin up Core Infrastructure
```bash
docker-compose up -d
```

#### 2. Run the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser. (Email: `admin@amdox.corp`, Password: any).

#### 3. Run the NestJS Backend
```bash
cd backend
npm install --legacy-peer-deps
npx prisma generate
npm run dev
```
Open **`http://localhost:3000`** to connect or inspect Swagger docs at **`http://localhost:3000/api/docs`**.

#### 4. Run the Python AI Engine
```bash
cd ai-service
pip install -r requirements.txt
python app/main.py
```
Exposes endpoints on **`http://localhost:8000`**.
