
FROM node:20-alpine AS build

WORKDIR /api

COPY package.json ./

RUN yarn install --frozen-lockfile
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . ./

FROM node:20-alpine AS final

WORKDIR /api

EXPOSE 3000
RUN apk add --no-cache g++ 
COPY --from=build /api/node_modules /api/node_modules
COPY --from=build /api ./

RUN apk add --no-cache musl openssl
#RUN yarn run migrate

#ENV PORT=3000
#ENV DATABASE_URL="mongodb://mongoserver:27017/mondopushtest"

CMD ["yarn", "run", "start"]

