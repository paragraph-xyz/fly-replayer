# Tiny, deterministic Node image
FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 8080

CMD ["node", "index.js"]
