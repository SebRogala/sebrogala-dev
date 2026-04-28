# Multi-stage production build for Coolify deployment
# Stage 1: Build the static site with Astro
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies (using package-lock if present for reproducible builds)
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit || npm install --prefer-offline --no-audit

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve the built static files via nginx
FROM nginx:alpine AS runtime

# Copy the build output
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA-style fallback + asset caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
