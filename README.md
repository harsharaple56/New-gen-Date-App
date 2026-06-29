# Align — Dating App

A full-stack dating application: a React Native (Expo) mobile app, a React admin
panel, and a Node.js + Socket.IO backend with PostgreSQL.

## Features

- **Auth** — phone OTP + JWT sessions, rate-limited auth endpoints.
- **Discovery & matching** — swipe, match, and intro flows.
- **Realtime chat** — Socket.IO messaging with typing indicators and read receipts.
- **Subscriptions** — tiered plans (Razorpay-ready).
- **Admin panel** — users, matches, chats, reports/moderation, payments,
  notifications/broadcasts, and analytics dashboards.
- **Image uploads** — Cloudinary with local fallback.

## Tech stack

| Layer        | Stack                                                            |
| ------------ | --------------------------------------------------------------- |
| Mobile app   | React Native (Expo), React Navigation, React Query, Zustand     |
| Admin panel  | React + Vite, React Router, React Query, Zustand                |
| Backend      | Node.js, Express, TypeScript, Socket.IO                         |
| Database     | PostgreSQL + Prisma                                             |
| Realtime     | Socket.IO (+ Redis adapter for horizontal scaling)             |

## Project structure

```
.
├── backend/          # Express + Prisma + Socket.IO API
│   ├── src/          # app, routes, controllers, services, config, prisma schema
│   └── prisma/       # seed script
├── frontend-admin/   # React + Vite admin panel
├── screens/          # React Native screens
├── components/       # Shared RN components
├── navigation/       # RN navigation
├── services/         # RN API + socket clients
├── store/            # RN Zustand store
├── App.tsx           # RN entry
├── render.yaml       # Render blueprint (API + admin + Redis)
├── eas.json          # Expo EAS build profiles
└── DEPLOYMENT.md     # Full production deployment guide
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Expo CLI / EAS CLI (for the mobile app)

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env          # set DATABASE_URL, JWT_SECRET, etc.
npm install
npm run prisma:migrate        # apply the schema
npm run seed                  # optional demo data + admin user
npm run dev                   # http://localhost:5000  (routes under /api)
```

Seed logins:

- Admin: `admin@align.app` / `admin123`
- User: `aarav@example.com` / `password123` — dev OTP is always `123456`

### 2. Admin panel

```bash
cd frontend-admin
npm install
# optionally set VITE_API_URL=http://localhost:5000/api
npm run dev                   # http://localhost:5173
```

### 3. Mobile app (Expo)

```bash
npm install
npx expo start
```

API host is read from `EXPO_PUBLIC_API_HOST` (see `services/api.ts`):

- iOS simulator / web: `http://localhost:5000`
- Android emulator: `http://10.0.2.2:5000`
- Physical device: `http://<your-machine-LAN-IP>:5000`

## Environment variables

See `backend/.env.example` (development) and `backend/.env.production.example`
(production). Key variables:

| Variable        | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `DATABASE_URL`  | PostgreSQL connection (pooled in production)      |
| `DIRECT_URL`    | Direct connection used for migrations             |
| `JWT_SECRET`    | JWT signing secret                                |
| `CLIENT_URL`    | Comma-separated allowed origins (CORS + sockets)  |
| `REDIS_URL`     | Enables Socket.IO scaling across replicas         |
| `OTP_DEV_MODE`  | `true` logs OTP locally; **`false`** in production |
| `CLOUDINARY_*`  | Image uploads                                     |
| `RAZORPAY_*`    | Subscriptions                                     |

## Deployment

Production deployment for the backend (Render / Railway / AWS), PostgreSQL
(Supabase / Neon), Socket.IO scaling, the admin panel, and the Expo app via EAS
is documented in **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## License

MIT
