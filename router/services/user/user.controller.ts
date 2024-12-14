import express from "express";
import { getUser } from "./user.service";
const userController = express.Router();

userController.get("/:username", (req, res) => {
  getUser({ username: req.params.username })
    .then((user) => {
      res.setHeader("Content-Type", "image/jpeg");
      res.send(user.image);
    })
    .catch((err) => res.status(404).send("User not found!"));
});

export default userController;
