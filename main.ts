import express from "express";
import { config } from "dotenv";
import router from "./router";
import PrismaService from "./router/services/prisma/prisma.service";
config();
const app = express();
app.use(`/`, router);
app.listen(process.env.PORT, () => {
  console.log(`Project is currently listening ${process.env.PORT}`);
});
