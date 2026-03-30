FROM node:20-alpine

WORKDIR /var/www/app

COPY package.json yarn.lock ./

RUN corepack enable && yarn install

COPY . .

RUN yarn build

CMD ["node", "dist/server.js"]