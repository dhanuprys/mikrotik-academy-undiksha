#!/bin/sh
set -e

echo "🔄 Running database migrations..."

MAX_RETRIES=5
RETRY_DELAY=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if prisma migrate deploy 2>&1; then
    echo "✅ Migrations completed successfully"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "⚠️  Migration attempt $RETRY_COUNT/$MAX_RETRIES failed. Retrying in ${RETRY_DELAY}s..."
      sleep $RETRY_DELAY
    else
      echo "❌ Migrations failed after $MAX_RETRIES attempts. Exiting."
      exit 1
    fi
  fi
done

echo "🚀 Starting Next.js server..."
exec node server.js
