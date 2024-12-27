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
        username: username,
        isPublic: isPublic,
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
    return await UserModel.find({});
  }

  static async updateUser({ username, image, isPublic }: UserDto) {
    const user = await UserModel.findOneAndUpdate(
      { username },
      {
        image,
        isPublic,
      },
      { new: true }
    );

    return user;
  }
  static async deleteUser({ username }: UserDto) {}
}
