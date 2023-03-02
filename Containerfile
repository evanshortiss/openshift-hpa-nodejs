# First stage of the build is to install dependencies, and build from source
FROM registry.access.redhat.com/ubi8/nodejs-18 as build

WORKDIR /usr/src/app

ENV HUSKY=0
ENV HUSKY_SKIP_HOOKS=1

COPY --chown=1001:1001 package*.json ./
RUN npm ci
COPY --chown=1001:1001 tsconfig*.json ./
COPY --chown=1001:1001 src src
RUN npm run build

# Make a cached lightweight copy of node_modules
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal as deps
WORKDIR /usr/src/app
COPY --chown=1001:1001 --from=build /usr/src/app/package*.json/ .
COPY --chown=1001:1001 --from=build /usr/src/app/node_modules/ node_modules/
RUN npm prune --production

# Second stage of the build is to create a minimal container with just enough
# required to run the application, i.e production deps and compiled js files
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal

WORKDIR /usr/src/app

COPY --chown=1001:1001 --from=build /usr/src/app/build/ build/
COPY --chown=1001:1001 --from=deps /usr/src/app/package*.json/ .
COPY --chown=1001:1001 --from=deps /usr/src/app/node_modules/ node_modules/

# Configure a default host and port mapping. Without the FASTIFY_ADDRESS
# the process listens on localhost only instead of all interfaces
ENV FASTIFY_PORT=8080
ENV FASTIFY_ADDRESS=0.0.0.0

CMD [ "./node_modules/.bin/fastify", "start", "-l", "info", "app.js" ]