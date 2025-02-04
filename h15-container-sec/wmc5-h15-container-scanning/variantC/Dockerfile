FROM node:22-alpine

# base dir for the application
WORKDIR /work

# copy over the package information
COPY package*.json ./

# and install the dependencies
RUN npm ci --only=production

# copy over the rest of the app but ignore node_modules etc.
COPY . ./

# run node in production mode
ENV NODE_ENV=production

# do not run as root user
USER node

EXPOSE 8080

ENTRYPOINT [ "node", "server.js" ]
