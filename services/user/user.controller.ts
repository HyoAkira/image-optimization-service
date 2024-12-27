import express, { NextFunction, Request, Response } from "express";
import userService from "./user.service";
import { uploadHandler } from "@/middlewares/uploadHandler";
import imageValidationMiddleware from "@/middlewares/imageValidation";
import dataValidationHandler from "@/middlewares/dataValidationHandler";

const userController = express.Router();
userController.get("/", async (req, res) => {
  res.status(400).send();
});

userController.get("/:username", async (req, res) => {
  try {
    const user = await userService.getUser({ username: req.params.username });

    res.setHeader("Content-Type", "image/jpeg");

    res.send(user.image);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default userController;
