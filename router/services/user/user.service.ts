import PrismaService from "../prisma/prisma.service";

const prisma = new PrismaService();

//get
async function getAllUsers() {
  return await prisma.user.findMany();
}

async function createUser({ image, isPublic, username }: UserDto) {
  const user = prisma.user.create({
    data: {
      image: image,
      username: username,
      isPublic: isPublic,
    },
  });

  return user;
}
async function getUser({ username }: UserDto) {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
}
async function updateUser({ username, image, isPublic }: UserDto) {}
async function deleteUser({ username }: UserDto) {}
