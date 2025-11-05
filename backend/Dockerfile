# Use official Node.js runtime as the base image
FROM node:18-alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create uploads directories with proper permissions
RUN mkdir -p uploads/rooms uploads/dorms uploads/temp && \
    chown -R node:node uploads && \
    chmod -R 755 uploads

# Switch to non-root user for security
USER node

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]