FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production --omit=dev

COPY . .

EXPOSE 6000

USER node

CMD ["node", "server.js"]

