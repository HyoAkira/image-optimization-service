import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import router from "./router";
import PrismaService from "./services/prisma/prisma.service";

import { createRandomUser } from "./services/batchRequest";
import errorHandler from "./middlewares/errorHandler";
config();

const app = express();

app.use(`/`, router, errorHandler);

app.get(`*`, (req, res) => {
  res.status(404).send("Not found!");
});
app.listen(process.env.PORT, () => {
  console.log(`Proje port: ${process.env.PORT}`);
});
