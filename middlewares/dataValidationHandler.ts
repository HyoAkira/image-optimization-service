import compressionService from "@/services/compression/compression.service";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function dataValidationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // //fileSize byte olarak geliyor

  // console.log(req.file.size);
  console.log(req.route.path);
  try {
    switch (req.route.path) {
      case `/create`: {
        if (!req.file || req.file?.fieldname !== "profile") {
          throw { code: "null-profile-data" };
        }
        if (!req.body.username) {
          throw { code: "null-username-data" };
        }
        if (!req.body.tckn) {
          throw { code: "null-tckn-data" };
        }
        break;
      }
      case "/update": {
        if (!req.file || req.file?.fieldname !== "profile") {
          throw { code: "null-profile-data" };
        }
        if (!req.body.username) {
          throw { code: "null-username-data" };
        }
        break;
      }
      case "/security/create": {
        if (!req.body.ip) {
          throw { code: "null-ip-data" };
        }
        if (req.body.ip.length < 1) throw { code: "insufficient-ip-length" };

        break;
      }
    }
  } catch (error) {
    next(error);
  } finally {
    next();
  }
}
