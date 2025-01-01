import express, { NextFunction, Request, response, Response } from "express";

import { uploadHandler } from "@/middlewares/uploadHandler";
import imageValidationMiddleware from "@/middlewares/imageValidation";
import dataValidationHandler from "@/middlewares/dataValidationHandler";
import ApiService from "./api.service";
import corsValidaton from "@/middlewares/corsValidation";

const apiController = express.Router();
/**
 * @openapi
 * /api/users/{username}:
 *   get:
 *     tags:
 *       - api
 *     summary: "username|tckn|uuid ile kullanici verisi almani saglar"
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */

apiController.get("/users/:username", async (req, res, next) => {
  try {
    const user = await ApiService.getUser({ username: req.params.username });

    res.send({
      success: true,
      message: `Kullanıcı ${user.username} verisi alındı.`,
      data: {
        uuid: user.uuid,
        url: `${req.protocol}://${req.hostname}:${req.socket.localPort}/users/${user.uuid}`,
        base64: user.image.toString("base64"),
      },
    });
    return;
  } catch (error) {
    next(error);
  }
});

// apiController.get("/image/:uuid", async (req, res) => {
//   try {
//     const image = await ApiService.getUserImageWithUUIDResponse(
//       req.params.uuid
//     );
//     res.setHeader("Content-Type", "image/jpeg");

//     res.send(image);
//     return;
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// });

/**
 * @openapi
 * /api/create:
 *   post:
 *     tags:
 *      - api
 *     summary: "Yeni bir kullanıcı oluştur"
 *     description: "Verilen kullanıcı adı ve profil resmi ile yeni bir kullanıcı oluşturur."
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Yeni kullanıcının kullanıcı adı."
 *                 example: "john_doe"
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: "Kullanıcının profil resmi."
 *               tckn:
 *                 type: string
 *                 description: "Kullanıcı tckn."
 *                 example: 0001
 *     responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */

apiController.post(
  "/create",

  uploadHandler,
  dataValidationHandler,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = await ApiService.createUser({
        username: req.body.username,
        file: req.file,
        isPublic: true,
        tckn: req.body.tckn,
      });
      console.log(`Kullanıcı ${req.body.username} başarıyla oluşturuldu.`);

      res.send({
        success: true,
        message: `Kullanıcı ${req.body.username} başarıyla oluşturuldu.`,
        data: {
          uuid: user.uuid,
          url: `${req.protocol}://${req.hostname}:${req.socket.localPort}/users/${user.uuid}`,
          base64: user.image.toString("base64"),
        },
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
);
/**
 * @openapi
 * /api/update:
 *   put:
 *     tags:
 *      - api
 *     summary: "Mevcut kullanıcıyı güncelle, sadece username"
 *     description: "Kullanıcı adı ile mevcut kullanıcıyı günceller."
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Güncellenmek istenen kullanıcının kullanıcı adı."
 *                 example: "john_doe"
 *               tckn:
 *                 type: string
 *                 description: "Güncellenmek istenen kullanıcının tckn verisi."
 *                 example: "11111111111"
 *               isPublic:
 *                 type: boolean
 *                 description: "urlden girince herkese açık olsun mu?"
 *                 example: true
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: "Kullanıcının yeni profil resmi."
 *     responses:
 *       200:
 *         description: "Olumlu yanıt!"
 *       400:
 *         description: "Yetkisiz işlem!"
 *       500:
 *         description: "Sistem hatası!"
 */
apiController.put(
  "/update",
  uploadHandler,
  dataValidationHandler,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        file: req.file,
        username: req.body.username,
        tckn: req.body.tckn,
        isPublic: req.body.isPublic,
      };
      await ApiService.updateUser({
        ...data,
      });
      console.log(`Kullanıcı ${req.body.username} başarıyla güncellendi.`);
      res.json({
        success: true,
        message: `Kullanıcı ${req.body.username} başarıyla güncellendi.`,
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
);

/**
 * @swagger
 * /api/users:
 *  post:
 *    tags:
 *      - api
 *    summary: "Liste ile kullanıcı verisi al (username/tckn/uuid çalışır)"
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              usernames:
 *                type: array
 *                items:
 *                  type: string
 *                description: "Gönderilen kullanıcı adlarının listesi."
 *                example:
 *                  - "john_doe"
 *                  - "jane_doe"
 *    responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */

apiController.post(`/users/`, async (req, res, next) => {
  try {
    const { username, tckn, uuid } = req.body;
    const users = await ApiService.getAllUsers(username, tckn, uuid);
    const response = users.map((user) => {
      return {
        uuid: user.uuid,
        url: `${req.protocol}://${req.hostname}:${req.socket.localPort}/users/${user.uuid}`,
        base64: user.image.toString("base64"),
      };
    });

    res.send({
      success: true,
      message: `istenen kullanicilarin verisi cekildi!`,
      data: response,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});
/**
 * @swagger
 * /api/user_urls:
 *  post:
 *    tags:
 *      - api
 *    summary: "Liste halinde kullanıcı verisini sadece URL ve UUID olacak şekilde alır."
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              usernames:
 *                type: array
 *                items:
 *                  type: string
 *                description: "Gönderilen kullanıcı adlarının listesi."
 *            example:
 *              usernames:
 *                - "Dorcas.Weimann16"
 *                - "122ae2e8-4513-4f9c-84d0-d9a8a70c01b3"
 *    responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */
apiController.post(`/user_urls/`, async (req, res, next) => {
  try {
    const { username, tckn, uuid } = req.body;
    const users = await ApiService.getAllUsers(username, tckn, uuid);
    const response = users.map((user) => {
      return {
        uuid: user.uuid,
        url: `${req.protocol}://${req.hostname}:${req.socket.localPort}/users/${user.uuid}`,
      };
    });

    res.send({
      success: true,
      message:
        "istenen kullanicilarin bilgisi sadece uuid ve url olarak alindi.",
      data: response,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
});
/**
 * @swagger
 * /api/delete/{username}:
 *   delete:
 *     tags:
 *      - api
 *     summary: "Belirtilen kullanıcıyı siler. sadece username"
 *     description: "Bir kullanıcıyı sistemden silmek için kullanılır."
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: "Silinecek kullanıcının kullanıcı adı"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Başarılı işlem. Kullanıcı silindi."
 *       400:
 *         description: "Geçersiz kullanıcı adı veya eksik bilgi."
 *       404:
 *         description: "Kullanıcı bulunamadı."
 *       500:
 *         description: "Sunucu hatası."
 */
apiController.delete("/delete/:username", async (req, res, next) => {
  try {
    const response = await ApiService.deleteUser(req.params.username);
    res.send(response);
  } catch (error) {
    next(error);
  }
  return;
});
//
// /**
//  * @swagger
//  * /api/uniqueusers/{uuid}:
//  *   get:
//  *     tags:
//  *      - api
//  *     summary: "rastgele 1000 kullanıcı verir."
//  *     description: "2 tane büyük işlem içerdiği için uzun sürer!"
//  *     responses:
//  *       200:
//  *        description: "Olumlu yanit!"
//  *       400:
//  *        description: "yetkisiz islem!"
//  *       500:
//  *         description: "Sistem hatasi!"
//  */
// apiController.get(`/uniqueusers/`, async (req, res, next) => {

//     const usersnames = await ApiService.getUniqueNames(1000);
//     const userlist = usersnames.map((user) => {return {
//       username:user.username,
//       tckn:user.tckn,
//       uuid:user.uuid
//     }});
//     const users = await ApiService.getAllUsers(username, tckn, uuid);
//     const response = users.map((user) => {
//       return {
//         url: req.hostname + req.url + `/${user.username}`,
//         base64: user.image.toString("base64"),
//       };
//     });

//     res.send({
//       success: true,
//       message: "rastgele uyeler alindi!",
//       data: response,
//     });
//     return;
//   } catch (error) {
//     next(error);
//     return;
//   }
// });
/**
 * @swagger
 * /api/getrandomusernames:
 *  get:
 *    tags:
 *      - api
 *    summary: "rastgele 1000 kullanici adi verir"
 *    responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */
apiController.get(`/getrandomusernames/`, async (req, res, next) => {
  try {
    const users = await ApiService.getUniqueNames(1000);

    const namesArray = users.map((user) => user.username);

    res.send(namesArray);
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * @swagger
 * /api/security/{token}:
 *  get:
 *    tags:
 *      - security
 *    summary: "token veya ip ile bilgi cekmeye yarar"
 *    description: "Aynı ip birden fazla tokene ait olabileceği için çıktı değeri dizi olarak döner"
 *    parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        description: "token veya ip ile bilgi çekmeye yarar"
 *        schema:
 *          type: string
 *    responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */
apiController.get("/security/:token", async (req, res, next) => {
  try {
    console.log(req.params.token);
    const response = await ApiService.getCustomerAccount(req.params.token);
    res.send(response);
    return;
  } catch (error) {
    next(error);
  }
});
/**
 * @swagger
 * /api/security/create:
 *  post:
 *    tags:
 *      - security
 *    summary: "yeni token hesabi acar"
 *    description: "Yeni token hesabı açar, token otomatik generate olur. Kullanıcı ip set eder."
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip:
 *                 type: array
 *                 items:
 *                  type: string
 *                 description: "Set edilecek ip listesi"
 *                 example:
 *                  - 127.0.0.1
 *    responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */
apiController.post(
  "/security/create",
  dataValidationHandler,
  async (req, res, next) => {
    try {
      const response = await ApiService.createCustomerAccount(req.body.ip);
      res.send(response);
      return;
    } catch (error) {
      next(error);
    }
  }
);
/**
 * @swagger
 * /api/security/update:
 *  patch:
 *    tags:
 *      - security
 *    summary: "ip set guncelleme"
 *    description: "Kullanıcı ip'ler set eder, apikey token olarak kullanilir."
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip:
 *                 type: array
 *                 items:
 *                  type: string
 *                 description: "Set edilecek ip listesi"
 *                 example:
 *                  - 127.0.0.1
 *    responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */
apiController.patch("/security/update", async (req, res, next) => {
  try {
    const apikey = req.headers["apikey"] as unknown as string;
    const response = await ApiService.updateCustomerAccount(
      apikey,
      req.body.ip
    );
    res.send(response);
    return;
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/security/:
 *  delete:
 *    tags:
 *      - security
 *    summary: "token ile hesap siler"
 *    description: "Aynı ip birden fazla tokene ait olabileceği için çıktı değeri dizi olarak döner"
 *    responses:
 *       200:
 *        description: "Olumlu yanit!"
 *       400:
 *        description: "yetkisiz islem!"
 *       500:
 *         description: "Sistem hatasi!"
 */
apiController.delete("/security/", async (req, res, next) => {
  try {
    const apikey = req.headers["apikey"] as unknown as string;
    const response = await ApiService.deleteCustomerAccount(apikey);
    res.send(response);
    return;
  } catch (error) {
    next(error);
  }
});

export default apiController;
