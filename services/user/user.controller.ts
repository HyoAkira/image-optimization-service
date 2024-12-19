import express, { NextFunction, Request, Response } from "express";
import { getUser } from "./user.service";
import multer, { MulterError } from "multer";
import { createRandomUser } from "../batchRequest";
import PrismaService from "../prisma/prisma.service";

const userController = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5242880 }, //5mb
});

const uploadHandler = (req: Request, res: Response, next: NextFunction) => {
  upload.single("profile")(req, res, function (err) {
    if (err instanceof MulterError) {
      return res.status(400).send(`Dosya yükleme hatası: ${err.message}`);
    } else if (err) {
      return res.status(500).send(`Bilinmeyen hata: ${err.message}`);
    }
    next();
  });
};
const prisma = new PrismaService();

userController.get("/:username", (req, res) => {
  getUser({ username: req.params.username })
    .then((user) => {
      res.setHeader("Content-Type", "image/jpeg");
      res.send(user.image);
    })
    .catch((err) => res.status(404).send("Kullanıcı bulunumadı!"));
});

userController.post(
  "/upload",
  uploadHandler,
  async function (req: Request, res: Response, next: NextFunction) {
    const user = createRandomUser();
    console.log(req);
    if (req.file.fieldname !== "profile") {
      res.status(404).send("Dosya gerekiyor.");
      return;
    }

    try {
      await prisma.user.create({
        data: {
          username: user.username,
          image: req.file.buffer,
        },
      });
      console.log(`Kullanıcı ${user.username} başarıyla oluşturuldu.`);
      res.redirect(`/users/${user.username}`);
      return;
    } catch (error) {
      console.error(`Hata oluştu: ${error}`);
      next(new Error("Sistem Hatası"));
      return;
    }
  }
);

export default userController;
