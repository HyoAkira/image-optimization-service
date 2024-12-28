import SecurityModel from "@/models/security.model";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export default function securityValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const corsOptionsDelegate = async (req, callback) => {
    const requestIp =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const apikey = req.headers["apikey"];
    try {
      if (!apikey) callback(new Error("Not allowed by CORS"));
      const allowedIp = await SecurityModel.findOne({
        ip: {
          $in: [requestIp],
        },
        token: apikey,
      });
      if (allowedIp) {
        callback(null, { origin: true }); // IP adresi uygunsa erişime izin ver
      } else {
        callback(new Error("Not allowed by CORS")); // IP adresi uygun değilse hata döndür
      }
    } catch (err) {
      callback(err);
    }
  };
}
