import PrismaService from "../prisma/prisma.service";

const prisma = new PrismaService();

//get
export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function createUser({ image, isPublic, username }: UserDto) {
  const user = prisma.user.create({
    data: {
      image: image,
      username: username,
      isPublic: isPublic,
    },
  });

  return user;
}
export async function getUser({ username }: Partial<UserDto>) {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) throw new Error("User not found!");
  user.image = Buffer.from(user.image);
  return user;
}
export async function updateUser({ username, image, isPublic }: UserDto) {}
export async function deleteUser({ username }: UserDto) {}
