import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function imageValidationMiddleware(
  err: Error & {
    code: string;
  },
  req: Request,
  res: Response,
  next: NextFunction
) {
  //fileSize -> multerda da ayari var
  //
  req.file.size;
  return;
}
