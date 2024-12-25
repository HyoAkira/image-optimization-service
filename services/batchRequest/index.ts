import { basename, join } from "path";
import fs, { readdirSync, readFileSync, writeFileSync } from "fs";
import { faker } from "@faker-js/faker";
import UserModel from "@/models/Users.model";
import mongoose from "mongoose";
//BU SAYFA LOCALDEN DATASET GONDERMEK ICINDIR SUNUCUDA HICBIR ISLEVI YOK
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
    if (counter == 105000) return;
    const user = createRandomUser();
    const filePath = join(foldersPath, file);

    const fileBuffer = readFileSync(filePath);

    try {
      await UserModel.create({
        username: user.username,
        image: fileBuffer,
      });
      console.log(`Kullanıcı ${user.username} başarıyla oluşturuldu.`);
      counter++;
    } catch (error) {
      console.error(`Hata oluştu: ${error}`);
    }
  }
}
mongoose.connect("mongodb://0.0.0.0:27017/local?retryWrites=false").then(() => {
  createFakeData();
});
