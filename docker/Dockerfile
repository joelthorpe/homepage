FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/

WORKDIR /app/backend
RUN npm ci --omit=dev

WORKDIR /app
COPY backend ./backend
COPY public ./public

EXPOSE 8080

WORKDIR /app/backend
CMD ["npm", "start"]