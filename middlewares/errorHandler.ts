import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function errorHandler(
  err: Error & {
    code: string | number;
  },
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.code, err.name);
  console.error(err.stack);

  switch (err.code) {
    case 11000: {
      res.status(400).json({ error: "Bu kullanıcı adı alınmış." });
      next();
      break;
    }
    case `LIMIT_UNEXPECTED_FILE`: {
      res.status(400).json({ error: "Dosya eksik!" });
      next();
      break;
    }
    case `null-apikey`: {
      res.status(400).send({ error: "Api key eksik!" });
      next();
      break;
    }
    case "not-allowed-ip": {
      res.status(400).send({ error: "Yetkilendirme hatasi!" });
      next();
    }
    default: {
      res.status(500).json({ error: "BILINMEYEN HATA!" });
      next();
    }
  }
}
