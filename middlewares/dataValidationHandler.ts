import compressionService from "@/services/compression/compression.service";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function dataValidationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // //fileSize byte olarak geliyor

  // console.log(req.file.size);
  console.log(req.route);
  switch (req.route.path) {
    case `/create`: {
      if (req.file.fieldname !== "profile") {
        res.status(400).json({ error: "Dosya gerekiyor." });
        return;
      }
      if (!req.body.username) {
        res.status(400).json({ error: "Kullanıcı adı gerekiyor." });
      }
      break;
    }
  }
  next();
}
