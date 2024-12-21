# Build stage
FROM node:alpine AS build


WORKDIR /api

COPY package.json ./

RUN npm install

COPY . ./

FROM node:20-alpine AS final

EXPOSE 3000

WORKDIR /api


COPY --from=build /api/node_modules /api/node_modules

COPY . .

# ENV PORT=3000
# ENV DATABASE_URL="mongodb://mongoserver:27017/mondopushtest"
RUN apk add musl openssl
RUN npm run migrate
CMD npm run start
