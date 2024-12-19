import { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5242880 }, //5mb
});

export const uploadHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("profile")(req, res, function (err) {
    if (err instanceof MulterError) {
      return res.status(400).json({
        error: `Dosya yükleme hatası: ${err.message}`,
      });
    } else if (err) {
      return res.status(500).send({ error: `Bilinmeyen hata: ${err.message}` });
    }
    next();
  });
};
