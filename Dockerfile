# Use node:20-slim as the base image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl && apt-get clean

# Install Corepack explicitly and enable PNPM
RUN npm install -g corepack && corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using PNPM
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Run Prisma generation
RUN npx prisma generate

# Set environment to production
ENV NODE_ENV=production

# Run the build step
RUN pnpm run build

# Use a non-root user for security
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]
#