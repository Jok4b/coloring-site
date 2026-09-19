# Builds the website + admin into one container.
# The application source travels in source.tar.gz next to this file;
# Docker unpacks it automatically on the ADD line below.
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ADD source.tar.gz ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm ci --legacy-peer-deps
# The database is not needed while building.
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV MEDIA_DIR=/app/media

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Uploaded images live here. Attach a volume at this path so they survive restarts.
RUN mkdir -p /app/media && chown -R nextjs:nodejs /app/media

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
