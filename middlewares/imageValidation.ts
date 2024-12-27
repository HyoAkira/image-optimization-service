import compressionService from "@/services/compression/compression.service";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function imageValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // //fileSize byte olarak geliyor

  // console.log(req.file.size);
  //burasi ileride!

  next();
}
