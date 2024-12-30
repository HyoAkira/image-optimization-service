import UserModel, { UserDto } from "@/models/Users.model";

import compressionService from "../compression/compression.service";
import { readFile, readFileSync } from "fs";
import path, { join } from "path";
import { Request } from "express";
import SecurityModel from "@/models/security.model";

export default class UserService {
  // sadece uuid ara
  static async getUser({
    username,
    req,
  }: Partial<UserDto> & {
    req: Request;
  }) {
    try {
      const user = await UserModel.findOne({ uuid: username });
      if (!user) {
        throw { code: "user-not-exist" };
      }
      const requestIp =
        req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress;
      const apikey = req.headers["apikey"];
      if (apikey) {
        const allowedIp = await SecurityModel.findOne({
          ip: {
            $in: [requestIp],
          },
          token: apikey,
        });
        if (allowedIp) {
          user.image = Buffer.from(user.image);
          return user;
        }
      }

      if (!user.isPublic) {
        const blank = readFileSync(
          join(__dirname, `../../assets/images/blankProfile.jpg`)
        );
        user.image = Buffer.from(blank);
      } else {
        user.image = Buffer.from(user.image);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
