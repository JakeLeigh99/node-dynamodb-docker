FROM node:18-bullseye

WORKDIR /app

# Clean install with --omit=optional to prevent native builds
COPY package.json package-lock.json ./
RUN npm ci --omit=optional

COPY . .

CMD ["npm", "run", "dev"]
