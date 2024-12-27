import UserModel from "@/models/Users.model";
import { UserDto } from "@/services/user/dto/userDto";
import compressionService from "../compression/compression.service";

export default class ApiService {
  static async createUser({
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
      const user = await UserModel.create({
        image: optimizedImage ?? file.buffer,
        username,
        isPublic,
      });

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getUser({ username }: Partial<UserDto>) {
    const user = await UserModel.findOne({ username });

    if (!user) throw new Error("Kullanıcı bulunamadı!");

    return user;
  }

  static async getAllUsers() {
    try {
      const users = await UserModel.find({}).limit(50);
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
  static async deleteUser({ username }: UserDto) {}
}
