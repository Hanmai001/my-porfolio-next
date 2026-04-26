# Example Docker file for Nextjs App
# Stage 1: Building the app
FROM node:20.19.0-alpine AS builder

# Set the working directory in the Docker container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the Next.js application
RUN yarn build

# Stage 2: Run the app in production mode
FROM node:20.19.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only the standalone output (includes minimal node_modules)
COPY --from=builder /app/.next/standalone ./
# Static assets must be copied separately
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# standalone output produces server.js as the entrypoint
CMD ["node", "server.js"]