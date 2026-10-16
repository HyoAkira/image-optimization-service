# Image Optimisation Service

A Node.js REST API that stores one profile image per user and serves it over
HTTP. Images are uploaded as `multipart/form-data`, re-encoded to JPEG at
quality 80 when the uploaded file is larger than 50 KB, stored in MongoDB, and
returned by UUID. The service does **not** resize images to fixed
dimensions: the only image transform in the codebase is the JPEG quality
re-encode in `services/compression/compression.service.ts`, and no `resize`
call exists anywhere in the repository.

## What it is

The service keeps a small user directory. Each record has a `username`, a
`tckn` identifier, a generated `uuid`, an `isPublic` flag and the profile
image itself as a MongoDB `Buffer` (`models/Users.model.ts`). Clients upload a
profile image, the server optionally optimises it, and anyone can fetch the
rendered picture from `GET /users/<uuid>` — the route parameter is named
`:username`, but the handler matches it against the record's `uuid`
(`services/user/user.controller.ts`, `services/user/user.service.ts`). When a profile is marked private,
the server substitutes a bundled blank avatar instead of the real image
(`services/user/user.service.ts`, `assets/images/blankProfile.jpg`).

The API surface is split into two routers under a single Express app
(`main.ts` -> `router/controller.ts`):

- `/users/*` — public image rendering.
- `/api/*` — management endpoints (create, update, delete, list, random
  usernames, and API-key management), gated by an API-key and IP allowlist.

Interactive OpenAPI documentation is served at `/docs`, and the raw
specification at `/docs.json` (`main.ts`, `services/swagger/swagger.ts`).

## Features

- Upload a profile image via `multipart/form-data` using the `profile` field;
  files are held in memory by Multer (`middlewares/uploadHandler.ts`).
- Automatic optimisation: uploads larger than 50,000 bytes are re-encoded to
  JPEG at quality 80 with `sharp` (`services/api/api.service.ts`,
  `services/compression/compression.service.ts`).
- Content-addressed images: an MD5 hash of the stored bytes is kept in the
  `imageHash` field, and an update whose new image hashes to the same value
  does not rewrite the image (`models/Users.model.ts`,
  `services/api/api.service.ts`).
- Create, update, delete and batch-list users, plus random-username sampling
  (`services/api/api.controller.ts`, `services/api/api.service.ts`).
- Public vs private profiles with a blank-avatar fallback for non-public
  records (`services/user/user.service.ts`).
- API-key plus IP-allowlist authorisation for `/api` and `/docs`; the
  allowlist is stored in the `security` collection
  (`middlewares/corsValidation.ts`, `middlewares/docsIPValidation.ts`,
  `models/security.model.ts`).
- API-key lifecycle management: create, read, update and delete tokens
  (`services/api/api.controller.ts`).
- Swagger/OpenAPI 3.0 documentation generated from route annotations
  (`services/swagger/swagger.ts`).
- Structured request logging to `app.log` and the console via Morgan and
  Winston (`middlewares/logger.ts`, `main.ts`).
- Docker packaging and a GitHub Actions deployment workflow
  (`Dockerfile`, `docker-compose.yaml`, `.github/workflows/deploy.yml`).

## Tech stack

| Layer | Choice | Source |
| --- | --- | --- |
| Runtime | Node.js (Alpine image), TypeScript | `Dockerfile`, `tsconfig.json` |
| HTTP framework | Express 4 | `package.json`, `main.ts` |
| Database | MongoDB 7.0 via Mongoose 8 | `docker-compose.yaml`, `models/*.ts` |
| Image processing | sharp (re-encode); `canvas` referenced by a dev script | `services/compression/compression.service.ts`, `services/batchRequest/index.ts` |
| Uploads | multer (memory storage) | `middlewares/uploadHandler.ts` |
| Docs | swagger-jsdoc + swagger-ui-express | `services/swagger/swagger.ts` |
| Logging | morgan + winston | `main.ts`, `middlewares/logger.ts` |
| Dev runner | tsx | `package.json` |
| Packaging | Docker Compose (api, mongodb, nginx) | `docker-compose.yaml` |
| CI/CD | GitHub Actions on a self-hosted runner | `.github/workflows/deploy.yml` |

## Architecture

```
                 +-------------------------------+
   HTTP client   |            nginx              |
   ------------> |  :8080 -> proxy_pass api:3000 |
                 +---------------+---------------+
                                 |
                                 v
                 +-------------------------------+
                 |        Express app (main.ts)  |
                 |  /docs, /docs.json, /         |
                 +---------------+---------------+
                                 |
                                 v
                 +-------------------------------+
                 |   router/controller.ts        |
                 |   /users        /api          |
                 +---+---------------+-----------+
                     |               |
                     v               v
            user.controller    api.controller
            user.service       api.service
                     \             /
                      v           v
                 +-------------------------------+
                 |  Mongoose models              |
                 |  users, security              |
                 +---------------+---------------+
                                 |
                                 v
                 +-------------------------------+
                 |        MongoDB (mongoserver)  |
                 |        db: local, :27017      |
                 +-------------------------------+
```

Prose: `main.ts` connects to MongoDB using `DATABASE_URL` (default
`mongodb://0.0.0.0:27017/local?retryWrites=false`) before it starts listening
on `PORT`, then mounts the JSON body parser, request logging, the documentation
routes and the application router. `router/controller.ts` mounts
`user.controller` at `/users` and `api.controller` at `/api`, wrapping the
latter in `cors(corsValidation)` so every `/api` request is checked against the
`security` collection. Controllers stay thin and delegate to
`user.service` / `api.service`, which read and write the `users` and `security`
Mongoose models. In the Compose stack, requests enter through nginx on port
8080, are proxied to the `api` container on port 3000, and MongoDB runs as the
`mongoserver` container on 27017 (`nginx/default.conf`, `docker-compose.yaml`,
`Dockerfile`).

## Getting started

Prerequisites: Node.js and npm, plus Docker and Docker Compose for the
containerised path. TypeScript, `tsx` and all runtime dependencies are declared
in `package.json`.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the environment. `main.ts` reads two variables through `dotenv`:

   | Variable | Purpose | Default in code |
   | --- | --- | --- |
   | `PORT` | HTTP listen port | none (must be set; 3000 in `.env` and `Dockerfile`) |
   | `DATABASE_URL` | MongoDB connection string | `mongodb://0.0.0.0:27017/local?retryWrites=false` |

   A committed `.env` holds only local development values (`PORT = 3000` and a
   localhost MongoDB URL); it contains no real credentials. A `pnpm-lock.yaml`
   is committed and `package.json` declares a pnpm `packageManager`, but the
   npm scripts and the `Dockerfile` use `npm`.

3. Start depending on how you want to run it:

   - Locally, against a MongoDB reachable at the configured URL:

     ```bash
     npm run start   # tsx main.ts
     npm run dev     # tsx --watch main.ts
     ```

   - With Docker Compose (builds the API image and starts `mongodb`, `api` and
     `nginx`):

     ```bash
     npm run migrate   # git pull && docker-compose up --build -d
     ```

   Note that `migrate` does not run a database migration; it pulls the branch
   and (re)builds the Compose stack (`package.json`).

4. The server listens on the configured `PORT` (3000). Probe it at
   `http://localhost:3000/`, and open the docs at `http://localhost:3000/docs`.
   Through the Compose stack, nginx publishes port 8080
   (`docker-compose.yaml`).

There is no test suite: the `test` script in `package.json` is a placeholder
that exits with an error.

## Usage example

`/api` endpoints require both an `apikey` request header and a caller IP that
is present in the `security` collection (`middlewares/corsValidation.ts`), and
`/docs` requires the IP match alone (`middlewares/docsIPValidation.ts`). No
unauthenticated endpoint creates the first allowlist entry, so seed one
directly before calling `/api`; for example, against the Compose MongoDB:

```bash
docker compose exec mongodb mongosh --eval \
  'db.getSiblingDB("local").security.insertOne({ ip: ["127.0.0.1"], token: "dev-token" })'
```

Create a user with a profile image (the upload field must be named `profile`,
and the request must come from an allowlisted IP; use the IP exactly as the
server resolves it from `x-forwarded-for` / `req.ip` / the socket address):

```bash
curl -X POST http://localhost:3000/api/create \
  -H "apikey: dev-token" \
  -F "username=alice" \
  -F "tckn=1" \
  -F "profile=@./portrait.jpg"
```

The response contains the new `uuid`, the public image `url` and a base64 copy
of the stored image (`services/api/api.controller.ts`). Fetch the rendered
image by UUID — this route is public and only substitutes the blank avatar when
the profile is not public:

```bash
curl http://localhost:3000/users/<uuid> --output profile.jpg
```

Other management calls include `PUT /api/update`, `DELETE /api/delete/:username`,
`POST /api/users` (batch lookup returning base64 images), `POST /api/user_urls`
(batch lookup returning URLs only), `GET /api/getrandomusernames`, and the
`/api/security/*` token endpoints (`services/api/api.controller.ts`).

## Status and license

The project is an actively developed, non-production prototype. The core
upload/optimise/store/serve path is implemented, but several
pieces are incomplete: `middlewares/imageValidation.ts` is a stub that only
calls `next()`, the `services/batchRequest/index.ts` data generator imports
`canvas` (which is not declared in `package.json`) and is not mounted on any
route, and `mongoplayground/*.js` and `tempCodeRunnerFile.js` are ad-hoc
development scripts. There is no automated test suite, and the only workflow,
`.github/workflows/deploy.yml`, deploys on push to `main` via a self-hosted
runner.

Naming note: the repository was renamed to `image-optimization-service` on
2026-10-16, but the earlier code name `ytsm-project-romeo` still appears inside
the project — as the `name` in `package.json` and in the `lift` script
(`docker start ytsm-project-romeo_mongo6_1`). The route prefixes are `/users`
and `/api`, and the configured MongoDB database name is `local` in `.env`,
`Dockerfile` and `mongoplayground/*.js`, so no `ytsm` string survives in the
routes or the database name. Nothing was renamed in this repository.

License: no license file is present. `package.json` carries
`"license": "ISC"` as package metadata, but no `LICENSE` file is committed and
GitHub reports no detected license.
