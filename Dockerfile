FROM node:20-alpine

WORKDIR /api

COPY . /api

# RUN yarn

# EXPOSE 3000

# ENV PORT=3000

RUN apk add openssl

CMD [ "npm", "run", "start" ]