# Multi-stage build for production-ready Node.js container
FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies based on package.json
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Environment defaults
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
