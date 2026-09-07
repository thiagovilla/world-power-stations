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
├── terraform/                 # Infrastructure as Code (AWS Free Tier Architecture)
│   ├── main.tf                # Providers, versions & default tags
│   ├── variables.tf           # Configurable variables & free-tier defaults
│   ├── vpc.tf                 # VPC, public subnets & isolated RDS subnets
│   ├── security_groups.tf     # Least-privilege network security groups
│   ├── rds.tf                 # Amazon RDS PostgreSQL 16 (db.t3.micro)
│   ├── ec2.tf                 # Compute instance (t3.micro) + IAM role
│   ├── s3.tf                  # Amazon S3 bucket for station photos
│   ├── cloudfront.tf          # CloudFront CDN edge distribution & OAC
│   ├── outputs.tf             # IP addresses, hostnames & connection endpoints
│   ├── terraform.tfvars.example
│   └── templates/
│       └── user_data.sh.tpl   # EC2 boot: 2GB swap, Docker CE, AWS CLI & system tuning
├── nginx/
│   └── nginx.conf             # Production reverse proxy gateway config
├── .github/
│   └── workflows/
│       ├── ci.yml             # Automated CI: Spring tests, Remix tests, Docker & Terraform validation
│       └── deploy.yml         # Containerized CD: ECR image push, EC2 deploy & CloudFront purge
├── docker-compose.yml         # Local development orchestration (Backend + Frontend + PostGIS)
├── docker-compose.prod.yml    # Production container orchestration (Backend + Frontend + Nginx)
└── package.json               # Monorepo orchestration & Terraform scripts
```

## Tech Stack Overview

- **Frontend**: Remix (SSR / SEO-optimized), React 18, Vite, TypeScript
- **Backend**: Java 21, Spring Boot 3.4, Spring Web, Spring Actuator, Spring Validation
- **Database**: PostgreSQL 16 with PostGIS extension (`postgis/postgis:16-3.4-alpine` local / RDS `db.t3.micro` production)
- **Testing**: JUnit 5, MockMvc, Vitest, React Testing Library
- **Infrastructure as Code**: Terraform / OpenTofu (VPC, RDS PostgreSQL, EC2, S3, CloudFront)
- **Containerization & CI/CD**: Docker multi-stage builds, Docker Compose, GitHub Actions
- **Cloud & Hosting**: AWS Free Tier (EC2 `t3.micro`, RDS `db.t3.micro`, S3, CloudFront)

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

## Infrastructure as Code & AWS Free Tier Deployment

The production infrastructure is codified using **Terraform / OpenTofu** inside the `terraform/` directory. It provisions a production-ready stack optimized specifically for the **AWS Free Tier**:

| Layer | Resource | AWS Free Tier Specification | Cost Optimization |
| :--- | :--- | :--- | :--- |
| **Compute** | Amazon EC2 | `t3.micro` (1 vCPU, 1 GB RAM, 20 GB gp3) | Configured with 2 GB Linux Swap & `-XX:+UseSerialGC` |
| **Database** | Amazon RDS | `db.t3.micro` (PostgreSQL 16 + PostGIS) | Dedicated 1 GB RAM, 20 GB gp2 cap, isolated private subnet |
| **Edge & CDN** | Amazon CloudFront | `PriceClass_100` (Global Edge CDN) | 1 TB data transfer & 10M requests (Always Free) |
| **Media Storage** | Amazon S3 | Standard (`wps-photos-*`) | 5 GB storage with Origin Access Control (OAC) |
| **Networking** | Amazon VPC | Multi-AZ Public/Private Subnets | Direct routing, no NAT Gateway ($0/month network charge) |

### Free Tier Memory & Runtime Optimization

1. **2 GB Linux Swap**: On 1 GB EC2 instances, memory spikes during container startup can trigger the Linux OOM-killer. The cloud-init script (`terraform/templates/user_data.sh.tpl`) allocates a 2 GB swapfile on the EBS volume and tunes `vm.swappiness=10`.
2. **Spring Boot JVM Tuning**: `docker-compose.prod.yml` restricts heap allocation via:
   ```bash
   JAVA_TOOL_OPTIONS="-Xms192m -Xmx256m -XX:+UseSerialGC -XX:TieredStopAtLevel=1"
   ```
3. **Nginx Reverse Proxy Gateway**: Runs in a minimal Alpine container (< 5 MB RAM) handling port 80 traffic, compressing payloads, and routing `/api/*` and `/actuator/*` to Spring Boot and all other routes to Remix SSR.

### Provisioning Infrastructure with Terraform

1. **Navigate to Terraform directory & create variables**:
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Initialize Terraform / OpenTofu**:
   ```bash
   npm run tf:init
   # or: cd terraform && terraform init
   ```

3. **Review Execution Plan**:
   ```bash
   npm run tf:plan
   # or: cd terraform && terraform plan
   ```

4. **Apply Infrastructure**:
   ```bash
   npm run tf:apply
   # or: cd terraform && terraform apply
   ```

5. **Tear Down / Destroy Resources** (to ensure $0 billing when not in use):
   ```bash
   npm run tf:destroy
   ```

---

## CI/CD Pipeline

- **Continuous Integration (`.github/workflows/ci.yml`)**:
  - Builds and executes unit tests for Spring Boot backend (`./gradlew test`).
  - Runs type checking, unit tests, and production build for Remix frontend (`vitest`, `tsc`, `vite:build`).
  - Verifies multi-stage Docker build artifacts for both services.
  - Formats and validates all Terraform infrastructure configurations (`terraform fmt -check`, `terraform validate`).
- **Continuous Deployment (`.github/workflows/deploy.yml`)**:
  - Triggered on git version tags (e.g. `v1.0.0`) or manual workflow dispatch.
  - Builds and publishes multi-arch container images to Amazon ECR (`wps-backend`, `wps-frontend`).
  - Securely deploys updated containers to the EC2 host via SSH/Docker Compose with zero manual downtime.
  - Automatically invalidates CloudFront edge distribution cache (`aws cloudfront create-invalidation`).
