import express from "express";
import { config } from "dotenv";
import router from "./router";
import errorHandler from "./middlewares/errorHandler";

config();

const app = express();

app.use(`/`, router, errorHandler);

app.get(`*`, (req, res) => {
  res.status(404).send("Not found!");
});

app.listen(+process.env.PORT, "0.0.0.0", () => {
  console.log(`Proje port: ${process.env.PORT}`);
});
