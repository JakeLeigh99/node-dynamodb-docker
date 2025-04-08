# Use node:18-alpine as the base image
FROM node:18-alpine

# This creates and sets `/app` as the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory, which will be cached unless deps change
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Tells Docker that the container will use port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]