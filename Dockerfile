FROM node:12.16.3-alpine

WORKDIR /usr/src/app

# Dependencies
COPY ./package.json .
COPY ./yarn.lock .
COPY ./packages/client/package.json ./packages/client/
COPY ./packages/server/package.json ./packages/server/

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    git \
    python \
    make \
    g++ \
    && yarn install \
    && apk del build-dependencies

# Files
COPY . .

ENV REACT_APP_NETWORK_ID=4

# Test contract on local chain
# RUN yarn test:rinkeby

# Deploy smart contracts
# RUN yarn sol:deploy-rinkeby

# Build
RUN yarn heroku:build

# Port
EXPOSE 3001

# Serve
CMD [ "yarn", "serve" ]
