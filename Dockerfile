FROM node:22.22.2-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV SESSION_SECRET=build_dummy_secret_do_not_use
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV CI=true

# Build Next.js
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create storage directory for uploads
RUN mkdir storage && chown nextjs:nodejs storage

# Copy public directory
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Install Prisma globally so we can run migrations in production
RUN npm install -g prisma@6

# Copy entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["./docker-entrypoint.sh"]
