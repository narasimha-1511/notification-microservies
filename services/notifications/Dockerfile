FROM node:20-alpine

WORKDIR /usr/src/app

COPY yarn.lock .
COPY package.json .

RUN yarn install

COPY . .

ENV PORT=3002
EXPOSE ${PORT}

CMD ["yarn", "start"]