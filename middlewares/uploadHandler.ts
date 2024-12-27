import { error } from "console";
import { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
// error kismini 2ye ayiricam

const upload = multer({
  storage: multer.memoryStorage(),

  // limits: { fileSize: 5242880 }, //5mb 5242880 || Acaba bunu benim yazdigim katmanda yapsam cok da fark eder mi??
  //belki memory aliyor diye sorun saniriyorum, BURADA VERMEYECEGIM!
});

export const uploadHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("profile")(req, res, function (err) {
    try {
      if (err instanceof MulterError) {
        // res.status(400).json({
        //   error: `Dosya yükleme hatası: ${err.message}`,
        // });
        // throw new Error(err.message);
        next(err);
      } else if (err) {
        // res.status(500).send({ error: `Bilinmeyen hata: ${err.message}` });
        // throw new Error(err.message);
        next(err);
      }
      next();
    } catch (error) {
      console.log(error);
    }
  });
};
