FROM node:10
ENV NODE_ENV=development
ENV PORT=8080
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci \
    && npm cache clean --force
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm link
RUN npm run build
RUN npm install -g serve
EXPOSE 8080
ENTRYPOINT [ "serve", "-s", "build" ]