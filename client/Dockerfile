# client/Dockerfile

FROM node:18-alpine

# Install bash and dependencies (for better shell compatibility)
RUN apk add --no-cache bash

WORKDIR /app

# Copy only package.json first for caching
COPY package*.json ./

# Install dependencies (force install everything, not just production)
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 5173

# Use npx to make sure vite resolves correctly
CMD ["npx", "vite", "--host"]