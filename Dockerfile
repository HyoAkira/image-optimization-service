FROM node:20-alpine

WORKDIR /api

COPY . /api

RUN yarn

EXPOSE 3000

CMD [ "npm", "run", "start" ]