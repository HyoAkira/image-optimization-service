import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function errorHandler(
  err: Error & {
    code: string;
  },
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.code, err.name);
  console.error(err.stack);

  if (err.code == `P2002`) {
    res.status(400).json({ error: "Bu kullanıcı adı alınmış." });
    return;
  }
  res.status(500).json({ error: "Internal Server Error" });
  return;
}
