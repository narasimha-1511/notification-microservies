FROM node:20-alpine

WORKDIR /usr/src/app

COPY yarn.lock .
COPY package.json .

RUN yarn install

COPY . .

CMD ["yarn", "start"]