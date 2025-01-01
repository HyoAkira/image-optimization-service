import express, { Request } from "express";
import { config } from "dotenv";

import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";
import openapiSpecification from "./services/swagger/swagger";
import swaggerUi from "swagger-ui-express";
import router from "./router/controller";
import docsIPValidation from "./middlewares/docsIPValidation";
import cors from "cors";
import morgan from "morgan";
import logger from "./middlewares/logger";
config();

const app = express();

//database connection
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
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});
morgan.token("ip", (req: Request) => {
  const requestIp =
    (req.headers["x-forwarded-for"] as string) ||
    req.ip ||
    req.socket.remoteAddress;
  return requestIp;
});
app.use(
  morgan(":ip :method :url :status - :response-time ms :body", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

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
