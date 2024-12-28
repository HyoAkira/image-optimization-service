import path, { join } from "path";
import fs from "fs";
import { faker } from "@faker-js/faker";
import UserModel from "../../models/Users.model";
import mongoose from "mongoose";
import { createCanvas, loadImage } from "canvas";
import Sharp from "sharp";
import { fileURLToPath } from "url";
import crypto from "crypto";
// ES6 modül ortamında __dirname kullanımı

const width = 300;
const height = 400;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

export function createRandomUser() {
  return {
    username: faker.internet.username(),
    tckn: faker.internet.email(),
  };
}

export async function createFakeData1() {
  let counter = 0;

  for (let i = 0; i < 105000; i++) {
    try {
      const user = createRandomUser();
      const image = await loadImage(join(__dirname, "test.jpg")); // Resmi yükleyin
      ctx.drawImage(image, 0, 0, width, height);

      // Metni ayarla ve çiz
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(user.username, 15, 50);

      // Canvas'tan buffer alın
      const buffer = canvas.toBuffer();

      // Sharp ile işleyin
      const fileBuffer = await Sharp(buffer)
        .jpeg({
          quality: 90,
        })
        .toBuffer();

      // Kullanıcıyı MongoDB'ye kaydedin
      const uuid = crypto.randomUUID();

      await UserModel.create({
        username: user.username,
        image: fileBuffer,
        tckn: user.tckn,
        uuid,
      });

      console.log(`Kullanıcı ${user.username} başarıyla oluşturuldu.`);
    } catch (error) {
      console.error(`Hata oluştu: ${error.message}`);
    }
  }
}

mongoose
  .connect("mongodb://0.0.0.0:27017/local?retryWrites=false")
  .then(() => {
    console.log("MongoDB'ye bağlandı!");
    return createFakeData1();
  })
  .catch((err) => {
    console.error(`MongoDB bağlantı hatası: ${err.message}`);
  });
