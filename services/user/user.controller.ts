import express, { NextFunction, Request, Response } from "express";
import userService from "./user.service";
import { uploadHandler } from "@/middlewares/uploadHandler";
import imageValidationMiddleware from "@/middlewares/imageValidation";
import dataValidationHandler from "@/middlewares/dataValidationHandler";

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: "Yanlış işlem diye hata verir"
 */
const userController = express.Router();
userController.get("/", async (req, res) => {
  res.status(400).send({
    success: false,
    message: "Yanlış işlem",
    data: null,
  });
});

/**
 * @swagger
 * /users/{uuid}:
 *   get:
 *     tags:
 *      - default
 *     summary: "UUID ile kullanıcı verisi almayı sağlar."
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: "Kullanıcının UUID'si"
 *     responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */
userController.get("/:username", async (req, res, next) => {
  try {
    const user = await userService.getUser({
      username: req.params.username,
      req,
    });

    res.setHeader("Content-Type", "image/jpeg");

    res.send(user.image);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default userController;
