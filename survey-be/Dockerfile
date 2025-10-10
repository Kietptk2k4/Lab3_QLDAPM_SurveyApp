# syntax=docker/dockerfile:1

############################
# Stage 1: Dependencies
############################
FROM node:22-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

############################
# Stage 2: Runtime
############################
FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV PORT=80
ENV HOST=0.0.0.0

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -sf http://127.0.0.1:${PORT}/healthz || exit 1

# Nếu có script start trong package.json, dùng dòng dưới:
CMD ["npm","start"]
# CMD ["node","server.js"]
