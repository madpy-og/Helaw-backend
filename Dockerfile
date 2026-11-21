# -------------------------------------------------------------
# Stage 1: Build stage
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to JavaScript
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Production runner stage
# -------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist

# Use non-root node user for enhanced security
USER node

# Expose default application port
EXPOSE 3000

# Run the compiled server
CMD ["node", "dist/server.js"]
