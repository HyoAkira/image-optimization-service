FROM node:alpine AS build
# RUN apk add openssl
WORKDIR /api
COPY package.json ./
RUN yarn
COPY . ./


FROM node:20-alpine AS final
EXPOSE 3000
# RUN apk add openssl
COPY --from=build ./node_modules ./
ENV PORT=3000
ENV DATABASE_URL="mongodb://mongodb:27017/mondopushtest"


CMD [ "npm", "run", "start" ]