# World Power Stations (WPS)

An interactive world map and registry of power generation and energy storage plants worldwide.

## Monorepo Architecture

This repository is organized as a unified monorepo to maximize code cohesion, maintain feature velocity across domain models, and streamline full-stack CI/CD operations.

```
world-power-stations/
├── apps/
│   ├── backend/               # Spring Boot (Java 21) REST API
│   │   ├── src/
│   │   │   ├── main/java/com/wps/backend/
│   │   │   │   ├── config/    # CORS & Web configurations
│   │   │   │   ├── controller/# REST Endpoints (/api/hello, /api/stations)
│   │   │   │   ├── dto/       # Request / Response records
│   │   │   │   └── BackendApplication.java
│   │   │   └── test/          # JUnit 5 & Spring MockMvc tests
│   │   ├── build.gradle
│   │   └── Dockerfile
│   └── frontend/              # Remix SSR application (React + Vite + TypeScript)
│       ├── app/
│       │   ├── routes/        # Remix file-based routing (_index.tsx)
│       │   ├── entry.client.tsx
│       │   ├── entry.server.tsx
│       │   └── root.tsx
│       ├── test/              # Vitest & Testing Library tests
│       ├── vite.config.ts
│       └── Dockerfile
├── .github/
│   └── workflows/
│       ├── ci.yml             # Automated CI pipeline for Backend & Frontend
│       └── deploy.yml         # Containerized CD pipeline for AWS / Cloud
├── docker-compose.yml         # Multi-container orchestration (Backend + Frontend + PostGIS)
└── package.json               # Root monorepo workspace & orchestration scripts
```

## Tech Stack Overview

- **Frontend**: Remix (SSR / SEO-optimized), React 18, Vite, TypeScript
- **Backend**: Java 21, Spring Boot 3.4, Spring Web, Spring Actuator, Spring Validation
- **Database**: PostgreSQL 16 with PostGIS extension (`postgis/postgis:16-3.4-alpine`)
- **Testing**: JUnit 5, MockMvc, Vitest, React Testing Library
- **Containerization & CI/CD**: Docker multi-stage builds, Docker Compose, GitHub Actions
- **Cloud & Deployment Target**: AWS (ECR, ECS/App Runner)

## Getting Started

### Prerequisites

- Node.js >= 20.0.0 & npm >= 10.0.0
- Java JDK >= 21
- Docker & Docker Compose

### Running Locally (Development Mode)

1. **Install Frontend dependencies**:
   ```bash
   npm install
   ```

2. **Start the Backend API**:
   ```bash
   npm run dev:backend
   # Or directly:
   cd apps/backend && ./gradlew bootRun
   ```
   Backend will be available at: `http://localhost:8080` (API: `http://localhost:8080/api/hello`, `http://localhost:8080/api/stations`)

3. **Start the Frontend Application**:
   ```bash
   npm run dev:frontend
   ```
   Frontend will be available at: `http://localhost:3000` (or `http://localhost:5173`)

### Running with Docker Compose

Run the entire system (Frontend, Backend, PostgreSQL with PostGIS):

```bash
docker compose up --build -d
```

- **Frontend UI**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080/api/hello`
- **PostgreSQL / PostGIS**: `localhost:5432` (User: `postgres`, Pass: `postgres`, DB: `world_power_stations`)

To stop all containers:
```bash
docker compose down
```

## Running Tests

Run all unit & integration tests across the monorepo:

```bash
# Run both Backend and Frontend test suites
npm test

# Run Backend tests only (JUnit 5 / MockMvc)
npm run test:backend

# Run Frontend tests only (Vitest / Testing Library)
npm run test:frontend
```

## CI/CD Pipeline

- **Continuous Integration (`.github/workflows/ci.yml`)**:
  - Builds and executes unit tests for Spring Boot backend.
  - Runs type checking, unit tests, and production build for Remix frontend.
  - Verifies multi-stage Docker build artifacts for both services.
- **Continuous Deployment (`.github/workflows/deploy.yml`)**:
  - Packages production Docker containers and publishes images to Amazon ECR on release tag or manual dispatch.
  - Deploys updated container versions to target AWS environments.
