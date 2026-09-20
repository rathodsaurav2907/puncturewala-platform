# PunctureWala

An on-demand puncture-repair platform. This Docker environment starts a Node.js API and MongoDB.

## Start

1. Copy `.env.example` to `.env`.
2. Add the API project under `api/` (Node 22, Express, MongoDB driver or Mongoose).
3. Run `docker compose up --build`.

API: `http://localhost:4001`. Add a React Native or React client as a separate `web`/`mobile` service when its source is ready.

## Suggested milestones

- JWT roles: customer, provider, administrator
- service request lifecycle and provider matching
- location-aware search, ratings, payments, and analytics events
