import SecurityModel from "@/models/security.model";

export default async function corsValidaton(req, next) {
  const requestIp =
    req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress;

  console.log(requestIp);
  const apikey = req.headers["apikey"];
  try {
    if (!apikey) throw { code: "null-apikey" };
    const allowedIp = await SecurityModel.findOne({
      $and: [
        {
          ip: {
            $in: [requestIp],
          },
        },
        { token: apikey },
      ],
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
