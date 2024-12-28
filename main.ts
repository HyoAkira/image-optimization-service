import express from "express";
import { config } from "dotenv";
import router from "./router";
import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";
import cors from "cors";
import SecurityModel from "./models/security.model";
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
const corsOptionsDelegate = async (req, next) => {
  const requestIp =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const apikey = req.headers["apikey"];
  try {
    if (!apikey) throw { code: "null-apikey" };
    const allowedIp = await SecurityModel.findOne({
      ip: {
        $in: [requestIp],
      },
      token: apikey,
    });
    if (allowedIp) {
      next(null, { origin: true });
    } else {
      throw { code: "not-allowed-ip" };
    }
  } catch (err) {
    next(err);
  }
};
app.use(cors(corsOptionsDelegate));
app.get(`/`, (req, res) => {
  res.send("IMG Server");
});
app.use(`/`, router);
app.get(`*`, (req, res) => {
  res.status(404).send("Not found!");
});

app.use(errorHandler);
