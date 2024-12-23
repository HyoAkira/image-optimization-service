import { basename, join } from "path";
import fs, { readdirSync, readFileSync, writeFileSync } from "fs";
import { faker } from "@faker-js/faker";
import PrismaService from "../prisma/prisma.service";

const prisma = new PrismaService();

export function createRandomUser() {
  return {
    username: faker.internet.username(),
  };
}

async function createFakeData() {
  const foldersPath = join(__dirname, "../../", "dataset");
  const files = readdirSync(foldersPath);
  let counter = 0;

  for (const file of files) {
    if (counter == 25000) return;
    const user = createRandomUser();
    const filePath = join(foldersPath, file);

    const fileBuffer = readFileSync(filePath);

    try {
      await prisma.user.create({
        data: {
          username: user.username,
          image: fileBuffer,
        },
      });
      console.log(`Kullanıcı ${user.username} başarıyla oluşturuldu.`);
      counter++;
    } catch (error) {
      console.error(`Hata oluştu: ${error}`);
    }
  }
}
createFakeData();
async function readData() {
  const user = await prisma.user.findUnique({
    where: {
      username: "Kristina26",
    },
    select: {
      image: true,
      username: true,
    },
  });
  if (!user || !user.image) {
    console.error("User or image not found");
    return;
  }

  const imageBuffer = Buffer.from(user.image);
  writeFileSync(join(__dirname, "images", `${user.username}.jpg`), imageBuffer);
}
