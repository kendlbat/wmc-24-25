FROM node:22-alpine as base
WORKDIR /app

FROM base as server-deps
COPY package*.json .
RUN npm ci --only=production --omit=dev

FROM base as client-build
WORKDIR /app/client
COPY client/package*.json .
RUN npm ci --legacy-peer-deps
COPY client .
RUN npm run build

FROM base as final
WORKDIR /app
COPY --from=server-deps /app/node_modules ./node_modules
COPY --from=client-build /app/client/node_modules ./client/node_modules
COPY --from=client-build /app/client/dist ./client/dist
COPY . .

USER node
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]