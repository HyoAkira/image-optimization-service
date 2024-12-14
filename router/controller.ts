import express from "express";
import userController from "./services/user/user.controller";
const router = express.Router();

router.use("/users", userController);

router.get(`*`, (req, res) => {
  res.status(404).send("Not found!");
});
export default router;
