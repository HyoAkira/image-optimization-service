import SecurityModel from "@/models/security.model";

export default async function docsIPValidation(req, next) {
  const requestIp =
    req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

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
