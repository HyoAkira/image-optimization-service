import UserModel from "@/models/Users.model";
import { UserDto } from "./dto/userDto";
import compressionService from "../compression/compression.service";

//get
export async function getAllUsers() {
  return await UserModel.find({});
}

export async function createUser({
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
    console.log(error);
    throw error;
  }
}
export async function getUser({ username }: Partial<UserDto>) {
  const user = await UserModel.findOne({ username });

  if (!user) throw new Error("Kullanıcı bulunamadı!");
  user.image = Buffer.from(user.image);
  return user;
}
export async function updateUser({ username, image, isPublic }: UserDto) {
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
export async function deleteUser({ username }: UserDto) {}
