# PunctureWala Platform

An on-demand roadside tyre puncture repair and technician dispatch platform built with Node.js, Express, and MongoDB.

Part of the **[Microservices & ML Data Platform Ecosystem](../ECOSYSTEM.md)**.

---

## 🌟 Overview

PunctureWala connects stranded motorists with nearby qualified mobile puncture technicians. It handles the complete lifecycle of roadside service requests, real-time technician matching, rating aggregations, and transactional event logging.

### Architecture Role
* **Operational Ingestion Engine**: Emits booking completions and cancellation events consumed by the **[Service Analytics Dashboard](../service-analytics-dashboard/)**.
* **Churn Prevention Target**: Receives risk scores calculated by the **[Customer Churn Predictor](../customer-churn-predictor/)** to initiate targeted customer retention workflows.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js 22 (LTS)
* **Framework:** Express.js with async router support
* **Database:** MongoDB 8.0 with Mongoose ODM
* **Validation:** Joi schema validation
* **Testing:** Jest, Supertest, MongoMemoryServer
* **Containerization:** Docker & Docker Compose (Multi-stage Node Alpine)

---

## 🚀 Quick Start

### 1. Using Docker (Recommended)

```bash
# Start API (port 4001) and MongoDB (port 27018)
docker compose up --build -d

# Verify health status
curl http://localhost:4001/health

# View live logs
docker compose logs -f api
```

### 2. Running Locally

```bash
npm install
cp .env.example .env

# Seed initial technicians, bookings, and analytics
npm run seed

# Start development server
npm run dev

# Run automated tests
npm test
```

---

## 🔌 API Endpoints

### Health & Monitoring
* `GET /health` - Service health, uptime, and environment check

### Bookings (`/api/bookings`)
* `POST /api/bookings` - Create new roadside service request
* `GET /api/bookings` - Query bookings (filter by status, vehicle type, pagination)
* `GET /api/bookings/:id` - Fetch single booking details
* `PATCH /api/bookings/:id/status` - Update status (`pending`, `assigned`, `in-progress`, `completed`, `cancelled`)
* `DELETE /api/bookings/:id` - Cancel/remove booking

### Technicians (`/api/technicians`)
* `POST /api/technicians` - Register technician profile & specializations
* `GET /api/technicians` - List active technicians & ratings
* `GET /api/technicians/:id` - Get technician details & service metrics
* `PATCH /api/technicians/:id/availability` - Toggle technician on-duty status

### Analytics (`/api/analytics`)
* `GET /api/analytics/daily` - Daily operational metrics & revenue
* `GET /api/analytics/overview` - Service completion and cancellation breakdown

---

## 🧪 Testing

```bash
npm test
```
Includes integration tests covering end-to-end booking lifecycles, validation guards, and error middleware handling.
