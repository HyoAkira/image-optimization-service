import express from "express";
import { config } from "dotenv";

import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";
import openapiSpecification from "./services/swagger/swagger";
import swaggerUi from "swagger-ui-express";
import router from "./router/controller";
import docsIPValidation from "./middlewares/docsIPValidation";
import cors from "cors";

config();

const app = express();

mongoose
  .connect(
    process.env.DATABASE_URL ||
      "mongodb://0.0.0.0:27017/local?retryWrites=false"
  )
  .then((x) => {
    app.listen(+process.env.PORT, "0.0.0.0", () => {
      console.log(`Proje port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json({ limit: "150mb" })); // payload error fix
app.use(
  "/docs",
  cors(docsIPValidation),
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification)
);
app.get(`/docs.json`, cors(docsIPValidation), (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openapiSpecification);
});
app.get(`/`, (req, res) => {
  res.send("IMG Server");
});
app.use(`/`, router);
app.get(`*`, (req, res) => {
  res.status(404).send("Not found!");
});

app.use(errorHandler);
