import SecurityModel from "@/models/security.model";

export default async function docsIPValidation(req, next) {
  console.log(`${req.ip} adresinden istek geldi! /docs`);
  const requestIp =
    req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress;

  try {
    const allowedIp = await SecurityModel.findOne({
      ip: {
        $in: [requestIp],
      },
    });
    if (allowedIp) {
      next(null, { origin: true });
    } else {
      throw { code: "not-allowed-ip" };
    }
  } catch (err) {
    next(err);
  }
}
