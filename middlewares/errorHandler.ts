import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function errorHandler(
  err: Error & {
    code: string | number;
    keyPattern: string;
  },
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.code);

  switch (err.code) {
    case 11000: {
      const key = Object.keys(err.keyPattern)[0];
      res.status(400).json({
        success: false,
        message: `Bu ${key.toString()}  önceden alınmış.`,
      });
      next();
      break;
    }
    case `LIMIT_UNEXPECTED_FILE`: {
      res.status(400).json({ success: false, message: "Dosya eksik!" });
      next();
      break;
    }
    case `null-apikey`: {
      res
        .status(400)
        .send({ success: false, message: "Key yetkilendirme hatasi!" });
      next();
      break;
    }
    case "not-allowed-ip": {
      res
        .status(400)
        .send({ success: false, message: "Yetkilendirme hatasi!" });
      next();
      break;
    }
    case "null-profile-data": {
      res.status(400).send({ success: false, message: "Dosya eksik!" });
      next();
      break;
    }
    case "null-username-data": {
      res.status(400).send({ success: false, message: "username eksik!" });
      next();
      break;
    }
    case "null-tckn-data": {
      res.status(400).send({ success: false, message: "tckn eksik!" });
      next();
      break;
    }
    case "user-not-exist": {
      res
        .status(400)
        .send({ success: false, message: "Kullanıcı bulunamadı!" });

      next();
      break;
    }
    default: {
      res.status(500).json({ success: false, message: "BILINMEYEN HATA!" });
      next();
    }
  }
}
