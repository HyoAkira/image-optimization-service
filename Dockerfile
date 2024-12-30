
FROM node:alpine AS build

WORKDIR /api

COPY package.json ./

RUN npm install
#COPY prisma ./prisma
#RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . ./

FROM node:alpine AS final

WORKDIR /api

EXPOSE 3000
#RUN apk add --no-cache g++ 
COPY --from=build /api/node_modules /api/node_modules
COPY --from=build /api ./

#RUN apk add --no-cache musl openssl
#RUN yarn run migrate

ENV PORT=3000
ENV DATABASE_URL="mongodb://mongoserver:27017/local?retryWrites=false"


CMD ["npm", "run", "start"]

