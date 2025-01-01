import UserModel, { UserDto } from "@/models/Users.model";

import compressionService from "../compression/compression.service";
import crypto from "crypto";
import SecurityModel from "@/models/security.model";
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
  static async getUser({ username, tckn, uuid }: Partial<UserDto>) {
    // Dizilerden yalnızca dolu olanları seç
    const validCriteria = [
      username?.length && { username },
      tckn?.length && { tckn },
      uuid?.length && { uuid },
    ].filter(Boolean);

    // Eğer birden fazla kriter varsa hata döndür
    if (validCriteria.length !== 1) {
      throw { code: "too-many-data-getuser" };
    }

    // Kullanıcıları sorgula
    const user = await UserModel.findOne({
      $or: validCriteria, // `$or` içine kriterler dizisi geçiliyor
    });

    if (!user) throw { code: "user-not-exist" };
    console.log(user);
    return user;
  }
  // static async getUserImageWithUUIDResponse(username) {
  //   const user = await this.getUser({ username });
  //   user.image = Buffer.from(user.image);
  //   return user.image;
  // }
  static async getUniqueNames(size) {
    try {
      const users = await UserModel.aggregate([{ $sample: { size } }]);
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser({
    username,
    file,
    isPublic,
    tckn,
    uuid,
  }: Partial<UserDto> & { file: Express.Multer.File }) {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) throw { code: "user-not-exist" };
      let optimizedImage;
      if (file.size > 50000) {
        optimizedImage = await compressionService(file.buffer);
      }
      await user.updateOne({
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
  static async deleteUser(username) {
    try {
      const user = await UserModel.findOneAndDelete({ username });
      if (!user) {
        throw { code: "user-not-exist" };
      }
      return {
        success: true,
        message: `${user.username} basariyla silindi!`,
      };
    } catch (error) {
      throw error;
    }
  }
  static async getAllUsers(username: string[], tckn: string[], uuid: string[]) {
    try {
      // Dizilerden yalnızca dolu olanları seç
      const validCriteria = [
        username?.length && { username: { $in: username } },
        tckn?.length && { tckn: { $in: tckn } },
        uuid?.length && { uuid: { $in: uuid } },
      ].filter(Boolean);

      // Eğer birden fazla kriter varsa hata döndür
      if (validCriteria.length !== 1) {
        throw { code: "too-many-data-getuser" };
      }

      // Kullanıcıları sorgula
      const users = await UserModel.find({
        $or: validCriteria, // `$or` içine kriterler dizisi geçiliyor
      });
      if (users.length < 1) {
        throw { code: "users-not-exist" };
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async createCustomerAccount(ip: string[]) {
    try {
      const uuid = crypto.randomUUID();
      const hash = crypto.createHash("md5").update(uuid).digest("hex");

      const account = await SecurityModel.create({
        ip: ip,
        token: hash,
      });
      return {
        success: true,
        message: `başarıyla hesap açıldı!`,
        data: {
          token: account.token,
          ip: account.ip,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  static async updateCustomerAccount(token: string, ip: string[]) {
    try {
      const account = await SecurityModel.findOneAndUpdate(
        { token },
        {
          ip: ip,
        },
        { new: true }
      );
      if (!account) {
        throw { code: "user-not-exist" };
      }
      return {
        success: true,
        message: `başarıyla hesap güncellendi!`,
        data: {
          token: account.token,
          ip: account.ip,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  static async getCustomerAccount(token: string) {
    try {
      const account = await SecurityModel.find(
        {
          $or: [
            { token },
            {
              ip: {
                $in: [token],
              },
            },
          ],
        },
        { ip: 1, token: 1 }
      );
      if (!account || account.length < 1) {
        throw { code: "user-not-exist" };
      }
      return {
        success: true,
        message: `başarıyla hesap verisi alindi`,
        data: account.map((ac) => {
          return {
            token: ac.token,
            ip: ac.ip,
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  }
  static async deleteCustomerAccount(token: string) {
    try {
      const account = await SecurityModel.findOneAndDelete({ token });
      if (!account) {
        throw { code: "user-not-exist" };
      }
      return {
        success: true,
        message: `başarıyla hesap silindi!`,
      };
    } catch (error) {
      throw error;
    }
  }
}
