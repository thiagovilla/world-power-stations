# Base Node image
FROM node:22-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json ./
RUN npm install

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json vite.config.ts ./
COPY app ./app
RUN npm run build

# Production runtime stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 remix

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder --chown=remix:nodejs /app/build ./build

USER remix

EXPOSE 3000

CMD ["npm", "start"]
