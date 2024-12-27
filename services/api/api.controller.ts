import express, { NextFunction, Request, response, Response } from "express";

import { uploadHandler } from "@/middlewares/uploadHandler";
import imageValidationMiddleware from "@/middlewares/imageValidation";
import dataValidationHandler from "@/middlewares/dataValidationHandler";
import ApiService from "./api.service";

const apiController = express.Router();

apiController.get("/users/:username", async (req, res) => {
  try {
    const user = await ApiService.getUser({ username: req.params.username });
    res.send({
      url: req.hostname + req.url,
      base64: user.image.toString("base64"),
    });
    return;
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

apiController.post(
  "/create",

  uploadHandler,
  dataValidationHandler,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await ApiService.createUser({
        username: req.body.username,
        file: req.file,
      });
      console.log(`Kullanıcı ${req.body.username} başarıyla oluşturuldu.`);
      res.status(201).redirect(`/users/${req.body.username}`);
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
);

apiController.put(
  "/update",
  uploadHandler,
  async function (req: Request, res: Response, next: NextFunction) {
    if (req.file.fieldname !== "profile") {
      res.status(400).json({ error: "Dosya gerekiyor." });
      return;
    }
    if (!req.body.username) {
      res.status(400).json({ error: "Kullanıcı adı gerekiyor." });
    }

    try {
      await ApiService.updateUser({
        file: req.file,
        username: req.body.username,
      });
      console.log(`Kullanıcı ${req.body.username} başarıyla güncellendi.`);
      res.json({
        msg: `Kullanıcı ${req.body.username} başarıyla güncellendi.`,
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
);

apiController.post(`/users/`, async (req, res) => {
  const userlist = req.body.usernames;
  const users = await ApiService.getAllUsers(userlist);
  const response = users.map((user) => {
    return {
      url: req.hostname + req.url + `/${user.username}`,
      base64: user.image.toString("base64"),
    };
  });
  // let response=[];
  // users.forEach((user) =>
  //   response.push({
  //     url: req.hostname + req.url,
  //     base64: user.image.toString("base64"),
  //   })
  // );
  res.send(response);
  return;
});

apiController.post(`/user_urls/`, async (req, res) => {
  const userlist = req.body.usernames;
  const users = await ApiService.getAllUsers(userlist);
  const response = users.map((user) => {
    return {
      url: req.hostname + req.url + `/${user.username}`,
    };
  });
  // let response=[];
  // users.forEach((user) =>
  //   response.push({
  //     url: req.hostname + req.url,
  //     base64: user.image.toString("base64"),
  //   })
  // );
  res.send(response);
  return;
});

apiController.post(`/uniqueusers/`, async (req, res) => {
  const usersnames = await ApiService.getUniqueNames(1000);

  const userlist = usersnames.map((user) => user.username);

  const users = await ApiService.getAllUsers(userlist);
  const response = users.map((user) => {
    return {
      url: req.hostname + req.url + `/${user.username}`,
      base64: user.image.toString("base64"),
    };
  });
  // let response=[];
  // users.forEach((user) =>
  //   response.push({
  //     url: req.hostname + req.url,
  //     base64: user.image.toString("base64"),
  //   })
  // );
  res.send(response);
  return;
});

apiController.post(`/getRandomUsernames/`, async (req, res) => {
  const users = await ApiService.getUniqueNames(1000);

  const namesArray = users.map((user) => user.username);

  res.send(namesArray);
});

// let response=[];
// users.forEach((user) =>
//   response.push({
//     url: req.hostname + req.url,
//     base64: user.image.toString("base64"),
//   })
// );

export default apiController;
