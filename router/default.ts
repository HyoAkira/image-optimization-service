import express, { NextFunction, Request, Response } from "express";
import { createUser, getUser, updateUser } from "./user.service";
import { uploadHandler } from "@/middlewares/uploadHandler";
import imageValidationMiddleware from "@/middlewares/imageValidation";
import dataValidationHandler from "@/middlewares/dataValidationHandler";

const defaultControlelr = express.Router();

userController.get("/:username", async (req, res) => {
  try {
    const user = await getUser({ username: req.params.username });

    res.setHeader("Content-Type", "image/jpeg");
    res.send(user.image);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

userController.post(
  "/create",

  uploadHandler,
  dataValidationHandler,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await createUser({
        username: req.body.username,
        file: req.file,
      });
      console.log(`Kullanıcı ${req.body.username} başarıyla oluşturuldu.`);
      res.status(201).redirect(`/users/${req.body.username}`);
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
);

userController.put(
  "/update",
  uploadHandler,
  async function (req: Request, res: Response, next: NextFunction) {
    if (req.file.fieldname !== "profile") {
      res.status(400).json({ error: "Dosya gerekiyor." });
      return;
    }
    if (!req.body.username) {
      res.status(400).json({ error: "Kullanıcı adı gerekiyor." });
    }

    try {
      await updateUser({
        image: req.file.buffer,
        username: req.body.username,
      });
      console.log(`Kullanıcı ${req.body.username} başarıyla güncellendi.`);
      res.json({
        msg: `Kullanıcı ${req.body.username} başarıyla güncellendi.`,
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
);

export default userController;
