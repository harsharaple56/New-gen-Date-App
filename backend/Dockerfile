# syntax=docker/dockerfile:1

###############################################################################
# Stage 1 — build: install everything, generate Prisma client, compile TS.
###############################################################################
FROM node:20-slim AS builder
WORKDIR /app

# Prisma needs OpenSSL to download/run the query engine.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npm run build

###############################################################################
# Stage 2 — runtime: slim image with only production deps + compiled output.
###############################################################################
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

# Bring over the generated Prisma client + query engine and the compiled app.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma

# Run as the unprivileged user that ships with the node image.
USER node

EXPOSE 5000

# Apply pending migrations, then boot the API.
CMD ["npm", "run", "start:prod"]
