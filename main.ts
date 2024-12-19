import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import router from "./router";
import PrismaService from "./services/prisma/prisma.service";

import { createRandomUser } from "./services/batchRequest";
config();

const app = express();

app.use(`/`, router);
app.listen(process.env.PORT, () => {
  console.log(`Proje port: ${process.env.PORT}`);
});
