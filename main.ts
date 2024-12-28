import express from "express";
import { config } from "dotenv";
import router from "./router";
import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";

config();

const app = express();
app.use(express.json({ limit: "150mb" })); // payload error fix
app.get(`/`, (req, res) => {
  res.send("IMG Server");
});
app.use(`/`, router, errorHandler);
app.get(`*`, (req, res) => {
  res.status(404).send("Not found!");
});

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
