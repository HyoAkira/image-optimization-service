import UserModel from "@/models/Users.model";
import { UserDto } from "./dto/userDto";

//get
export async function getAllUsers() {
  return await UserModel.find({});
}

export async function createUser({ username, image, isPublic }: UserDto) {
  try {
    const user = await UserModel.create({
      image: image,
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
