# Align — Production Deployment Guide

End-to-end production setup for the Align stack:

| Component        | Tech                          | Recommended host                |
| ---------------- | ----------------------------- | ------------------------------- |
| Backend API      | Node + Express + Socket.IO    | Render / Railway / AWS Fargate  |
| Database         | PostgreSQL + Prisma           | Supabase / Neon                 |
| Realtime scaling | Socket.IO + Redis adapter     | Render Redis / Upstash          |
| Admin panel      | React + Vite (static)         | Render Static / Vercel          |
| Mobile app       | React Native (Expo)           | Expo EAS Build + Submit         |

```
                 ┌─────────────┐        ┌──────────────┐
   Expo app ───► │  Load        │ ─────► │  align-api    │ ──► Postgres (Supabase/Neon)
   Admin SPA ──► │  balancer     │ ◄────► │  (N replicas) │ ──► Cloudinary (images)
                 └─────────────┘  WS    └──────┬───────┘
                                                │  pub/sub
                                          ┌─────▼─────┐
                                          │   Redis    │  (Socket.IO adapter)
                                          └───────────┘
```

---

## 1. PostgreSQL — Supabase or Neon

Prisma needs **two** connection strings in production:

- `DATABASE_URL` → **pooled** connection (used by the running app).
- `DIRECT_URL` → **direct** connection (used only by `prisma migrate deploy`).

The schema is already wired for this (`backend/src/prisma/schema.prisma`):

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Supabase

1. Create a project → **Project Settings → Database**.
2. Copy the connection strings:
   - Pooled (Transaction mode, port **6543**) → `DATABASE_URL`, append `?pgbouncer=true&connection_limit=1&sslmode=require`.
   - Direct (Session mode, port **5432**) → `DIRECT_URL`, append `?sslmode=require`.

```bash
DATABASE_URL="postgresql://postgres.ref:PWD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://postgres.ref:PWD@aws-0-region.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Neon

1. Create a project → copy the **Pooled** connection string for `DATABASE_URL`.
2. Use the **Direct** (non-pooled) string for `DIRECT_URL`. Both require `?sslmode=require`.

### Apply schema + seed (one-time)

```bash
cd backend
# Run against the production DB from your machine, or let start:prod do it on boot.
DATABASE_URL="<direct-url>" DIRECT_URL="<direct-url>" npm run prisma:deploy
# Optional first-run seed (creates the admin user + demo data):
DATABASE_URL="<direct-url>" DIRECT_URL="<direct-url>" npm run seed
```

> `npm run start:prod` runs `prisma migrate deploy` automatically on every boot, so subsequent migrations ship with each deploy.

---

## 2. Backend API

Build/start scripts (`backend/package.json`):

- `npm run build` → `prisma generate && tsc` (emits to `dist/src`).
- `npm run start:prod` → `prisma migrate deploy && node dist/src/server.js`.

### Option A — Render (blueprint)

`render.yaml` at the repo root defines the API, the admin static site, and a Redis instance.

1. Push the repo to GitHub.
2. Render → **New → Blueprint** → pick the repo.
3. Fill the `sync: false` secrets: `DATABASE_URL`, `DIRECT_URL`, `CLIENT_URL`, Cloudinary/Razorpay keys, and `VITE_API_URL` for the admin site.
4. `JWT_SECRET` is auto-generated; `REDIS_URL` is auto-wired from the Redis service.
5. Deploy. Health check: `GET /health`.

> Add `DIRECT_URL` to the `align-api` env vars in the dashboard (kept out of the blueprint because it is a secret).

### Option B — Railway

`backend/railway.json` is preconfigured (Nixpacks build, `start:prod`, `/health` check).

```bash
railway init
railway add        # add PostgreSQL (or use Supabase/Neon) and Redis plugins
railway variables set DATABASE_URL=... DIRECT_URL=... JWT_SECRET=... CLIENT_URL=... REDIS_URL=... OTP_DEV_MODE=false
railway up
```

Set the service **Root Directory** to `backend` in the Railway dashboard.

### Option C — AWS (Fargate via Docker)

`backend/Dockerfile` is a multi-stage build that produces a slim runtime image.

```bash
cd backend
docker build -t align-api .
# Tag + push to ECR
aws ecr create-repository --repository-name align-api
docker tag align-api:latest <acct>.dkr.ecr.<region>.amazonaws.com/align-api:latest
docker push <acct>.dkr.ecr.<region>.amazonaws.com/align-api:latest
```

- Run on **ECS Fargate** behind an **Application Load Balancer**.
- ALB listener: enable **WebSockets** (ALB supports them natively) and a sticky **target group** if you serve Socket.IO long-polling (see §4).
- Inject env vars from **AWS Secrets Manager** / SSM Parameter Store.
- Use **ElastiCache (Redis)** for `REDIS_URL` and **RDS/Aurora Postgres** or Supabase/Neon for the DB.
- Health check path: `/health`.

Run the container locally to verify:

```bash
docker run -p 5000:5000 --env-file .env.production align-api
```

---

## 3. Socket.IO horizontal scaling

The app fans realtime events out across replicas using the **Redis adapter**
(`backend/src/config/socket.ts`). It activates automatically when `REDIS_URL`
is set — no code change needed:

```ts
function attachRedisAdapter(server) {
  if (!env.redisUrl) return;            // single instance → no Redis required
  const pub = new Redis(env.redisUrl);
  const sub = pub.duplicate();
  server.adapter(createAdapter(pub, sub));
}
```

Scaling checklist:

1. **Provision Redis** (Render Redis, Upstash, or ElastiCache) and set `REDIS_URL`
   (use the `rediss://` TLS URL where available).
2. **Run 2+ replicas** of `align-api`. With the adapter, a message sent on
   replica A is delivered to a user connected to replica B.
3. **Transport** — the clients connect with `transports: ['websocket']`
   (`services/socket.ts`), so a single upgraded connection avoids most
   sticky-session issues. If you ever allow HTTP long-polling, enable
   **sticky sessions** at the load balancer (ALB target-group stickiness, or
   Render/Railway handle this automatically).
4. **CORS** — `CLIENT_URL` must list every origin that opens a socket (admin
   domain + app web build). The Socket.IO server reuses `env.clientUrls`.

Verify after deploy:

```bash
# Should print "Socket.IO Redis adapter enabled" in the API logs at boot.
```

---

## 4. Admin panel (React + Vite)

- Build: `npm install && npm run build` → static `dist/`.
- Set `VITE_API_URL` to the **full API base including `/api`**, e.g.
  `https://align-api.onrender.com/api` (consumed in
  `frontend-admin/src/services/api.ts`).
- Render static site config is included in `render.yaml`; for Vercel/Netlify use
  the same build command, output `dist`, and a SPA rewrite to `/index.html`.

---

## 5. React Native app — Expo EAS

Config files: `eas.json` (build profiles) and `app.json` (bundle IDs, EAS
project, OTA updates). The API host is read from `EXPO_PUBLIC_API_HOST`
(`services/api.ts`), injected per profile in `eas.json`.

### One-time setup

```bash
npm install -g eas-cli
eas login
eas init                      # creates the EAS project, fills extra.eas.projectId
```

Then in `app.json` replace `REPLACE_WITH_EAS_PROJECT_ID` (project id + updates URL)
and set real `ios.bundleIdentifier` / `android.package` values.

### Configure API host per profile (`eas.json`)

```jsonc
"preview":    { "env": { "EXPO_PUBLIC_API_HOST": "https://align-api.onrender.com" } },
"production": { "env": { "EXPO_PUBLIC_API_HOST": "https://api.yourdomain.com" } }
```

### Build & submit

```bash
# Internal test build (APK / simulator):
eas build --profile preview --platform android

# Store-ready production builds:
eas build --profile production --platform all

# Upload to the App Store / Play Store:
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

### Over-the-air JS updates (no store review)

```bash
eas update --branch production --message "Hotfix"
```

> `runtimeVersion.policy: "appVersion"` ties OTA updates to native builds — bump
> the app version when you change native code, push OTA for JS-only changes.

---

## 6. Environment configuration reference

Backend secrets (template: `backend/.env.production.example`):

| Variable               | Required | Notes                                                |
| ---------------------- | -------- | ---------------------------------------------------- |
| `NODE_ENV`             | ✅       | `production`                                          |
| `PORT`                 | ✅       | `5000` (host may override)                            |
| `DATABASE_URL`         | ✅       | Pooled connection string                             |
| `DIRECT_URL`           | ✅       | Direct connection, used by migrations                |
| `JWT_SECRET`           | ✅       | `openssl rand -base64 48`                             |
| `JWT_EXPIRES_IN`       | ◻️       | Default `7d`                                          |
| `CLIENT_URL`           | ✅       | Comma-separated allowed origins (CORS + sockets)     |
| `REDIS_URL`            | ⚠️       | Required for **2+ replicas**; optional for one       |
| `OTP_DEV_MODE`         | ✅       | **Must be `false`** in production                    |
| `CLOUDINARY_*`         | ◻️       | Needed for image uploads                              |
| `RAZORPAY_*`           | ◻️       | Needed for paid subscriptions                        |

Admin (Vite): `VITE_API_URL` = `https://<api-host>/api`.

Mobile (Expo/EAS): `EXPO_PUBLIC_API_HOST` = `https://<api-host>` (no `/api`).

---

## 7. Post-deploy verification

```bash
# API health
curl https://<api-host>/health        # → {"success":true,"status":"ok",...}

# Auth smoke (dev OTP disabled in prod — use a real phone/SMS provider)
curl -X POST https://<api-host>/api/auth/request-otp -H "Content-Type: application/json" -d '{"phone":"+1..."}'
```

- Confirm API logs show **"Socket.IO Redis adapter enabled"** when `REDIS_URL` is set.
- Open the admin panel, log in, and confirm the dashboard loads live data.
- Launch a `preview` EAS build and verify the app reaches the deployed API.

---

## Security checklist before go-live

- [ ] `OTP_DEV_MODE=false` and a real SMS provider wired up.
- [ ] `JWT_SECRET` is a fresh 48-byte random value (not the dev default).
- [ ] `CLIENT_URL` lists only your real origins (no `*`, no localhost).
- [ ] Database uses `sslmode=require`; credentials stored in a secret manager.
- [ ] Rate limiting active (already on `/api/auth`).
- [ ] Helmet + CORS verified (already configured in `backend/src/app.ts`).
