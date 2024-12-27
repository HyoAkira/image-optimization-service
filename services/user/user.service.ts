import UserModel from "@/models/Users.model";
import { UserDto } from "./dto/userDto";
import compressionService from "../compression/compression.service";
import { readFile, readFileSync } from "fs";
import path, { join } from "path";

export default class UserService {
  static async getUser({ username }: Partial<UserDto>) {
    const user = await UserModel.findOne({ username });

    if (!user) throw new Error("Kullanıcı bulunamadı!");
    else if (!user.isPublic) {
      const blank = readFileSync(
        join(__dirname, `../../assets/images/blankProfile.jpg`)
      );
      user.image = Buffer.from(blank);
    } else {
      user.image = Buffer.from(user.image);
    }
    return user;
  }
}
