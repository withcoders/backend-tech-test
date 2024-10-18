FROM node:18-alpine

WORKDIR /app

COPY prisma package.json yarn.lock ./

RUN yarn install
RUN yarn add prisma
RUN yarn prisma generate
COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]