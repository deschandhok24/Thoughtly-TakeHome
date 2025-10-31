# Ticket Booking App (Manual Setup)

> Docker was having trouble installing on my old personal Mac, so these steps must be done manually.

## Prerequisites

- Postgres installed and running
- Node.js version 18
- npm

## Frontend

```bash
cd frontend/ticket-booking
npm install
npm run start
```

Frontend runs on port 3000.

## Backend

Create a new db called ticket_booking. The below assumes you are using the postgres superuser to do so.
```bash
psql -U postgres -c "CREATE DATABASE ticket_booking"
```

Update `backend/env` and set `DATABASE_URL` to match your local Postgres credentials, e.g.:

```
postgresql://<db_user>:<password>@127.0.0.1:5432/ticket_booking?connection_limit=10
```

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:generate
npm run seed
npm run start
```

Backend runs on port 5000.
