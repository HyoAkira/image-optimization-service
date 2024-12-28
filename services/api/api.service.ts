import UserModel, { UserDto } from "@/models/Users.model";

import compressionService from "../compression/compression.service";
import crypto from "crypto";
export default class ApiService {
  static async createUser({
    username,
    file,
    isPublic,
    tckn,
  }: Partial<UserDto> & { file: Express.Multer.File }) {
    try {
      let optimizedImage;
      if (file.size > 50000) {
        optimizedImage = await compressionService(file.buffer);
      }

      const uuid = crypto.randomUUID();
      // const hash = crypto.createHash("md5").update(uuid).digest("hex");

      const user = await UserModel.create({
        image: optimizedImage ?? file.buffer,
        username,
        isPublic,
        tckn,
        uuid,
      });

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // tckn, uuid ve username ile arar
  static async getUser({ username }: Partial<UserDto>) {
    const user = await UserModel.findOne({
      $or: [
        {
          username,
        },
        { tckn: username },
        { uuid: username },
      ],
    });

    if (!user) throw new Error("Kullanıcı bulunamadı!");

    return user;
  }
  static async getUserImageWithUUIDResponse(username) {
    const user = await this.getUser({ username });
    user.image = Buffer.from(user.image);
    return user.image;
  }
  static async getUniqueNames(size) {
    try {
      const users = await UserModel.aggregate([{ $sample: { size } }]);
      return users;
    } catch (error) {
      console.error(error);
    }
  }

  static async updateUser({
    username,
    file,
    isPublic,
  }: {
    username: string;
    file: Express.Multer.File;
    isPublic?: boolean;
  }) {
    try {
      let optimizedImage;
      if (file.size > 50000) {
        optimizedImage = await compressionService(file.buffer);
      }
      const user = await UserModel.updateOne(
        { username },
        {
          image: optimizedImage ?? file.buffer,
          username,
          isPublic,
        }
      );

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async deleteUser({}: UserDto) {}

  static async getAllUsers(userList) {
    try {
      const users = await UserModel.find({
        username: {
          $in: userList,
        },
      });
      return users;
    } catch (error) {
      console.error(error);
    }
  }
}
