import path, { join } from "path";
import sharp from "sharp";

export default async function compressionService(file) {
  const image = sharp(file);

  const pipe = await image.clone().jpeg({ quality: 80 }).toBuffer();
  return pipe;
}
