FROM node:10 as base
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production \
    && npm cache clean --force
# Bundle app source
COPY . .

FROM base as dev
ENV NODE_ENV=development
RUN npm install
RUN npm link
ENTRYPOINT [ "npm ", "start"]

FROM dev as test
ENV CI=true
COPY . .
ENTRYPOINT [ "npm", "run", "test"]

FROM base as prod
RUN npm run build
RUN npm install -g serve
ENTRYPOINT [ "serve", "-s", "build" ]