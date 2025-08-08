# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for Playwright
RUN apk add --no-cache \
    chromium \
    firefox \
    webkit2gtk \
    && rm -rf /var/cache/apk/*

# Set Playwright environment variables
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/bin
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create directories for reports
RUN mkdir -p reports/screenshots reports/videos reports/logs allure-results

# Set environment variables
ENV NODE_ENV=test
ENV HEADLESS=true
ENV CI=true

# Expose port for report server
EXPOSE 3000

# Default command
CMD ["npm", "test"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node --version || exit 1
