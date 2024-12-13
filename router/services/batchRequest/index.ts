// burada filelari mongoDB'ye atacagim

import { basename, join } from "path";
import { readdirSync, readFileSync } from "fs";
import { faker } from "@faker-js/faker";

function createRandomUser() {
  return {
    username: faker.internet.username(),
  };
}
//  const users =faker.helpers.multiple(createRandomUser, {
//    count: 5,
//  });
async function createFakeData() {
  const foldersPath = join(__dirname, "../../../", "dataset");
  const files = readdirSync(foldersPath);
  for (const file of files) {
    const filePath = join(foldersPath, file);
    const command = require(filePath);

    const;
  }
}

createFakeData();
