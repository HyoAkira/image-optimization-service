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

 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                   description: "kullanici uuid"
 *                   example: "uuid1234"
 *                 url:
 *                   type: string
 *                   description: "kullanici resim webden erismek icin url"
 *                   example: "http://example.com/users/uuid1234"
 *                 base64:
 *                   type: string
 *                   description: "kullanici resim bas64"
 *                   example: "iVBORw0KGgoAAAANSUhEUgAA..."
 *       404:
 *    
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Kullanici bulununamadi"
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
 *         description: "Kullanıcı başarıyla oluşturuldu"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                   description: "Yeni oluşturulan kullanıcının benzersiz tanımlayıcısı."
 *                   example: "12345"
 *                 username:
 *                   type: string
 *                   description: "Yeni oluşturulan kullanıcının kullanıcı adı."
 *                   example: "john_doe"
 *                 profileImageUrl:
 *                   type: string
 *                   description: "Kullanıcının profil resminin URL'si."
 *                   example: "http://localhost:3000/users/uuid"
 *       400:
 *         description: "Geçersiz istek, eksik veya yanlış parametreler"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Geçersiz istek durumunda hata mesajı."
 *                   example: "Gerekli alanlar eksik"
 *       500:
 *         description: "Sunucu içi hata"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Sunucu içi hata durumunda hata mesajı."
 *                   example: "Sunucu hatası"
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
 *     summary: "Mevcut kullanıcıyı güncelle"
 *     description: "Kullanıcı adı ve profil resmi ile mevcut kullanıcıyı günceller."
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
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: "Kullanıcının yeni profil resmi."
 *     responses:
 *       200:
 *         description: "Kullanıcı başarıyla güncellendi"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Güncelleme işleminin başarı mesajı."
 *                   example: "Kullanıcı john_doe başarıyla güncellendi."
 *       400:
 *         description: "Geçersiz istek, eksik veya yanlış parametreler"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Geçersiz istek durumunda hata mesajı."
 *                   example: "Dosya gerekiyor."
 *       500:
 *         description: "Sunucu içi hata"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Sunucu içi hata durumunda hata mesajı."
 *                   example: "Sunucu hatası"
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
 *    summary: "Liste ile kullanıcı verisi al"
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
 *      '200':
 *        description: "Kullanıcı listesi başarıyla alındı."
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    description: "Kullanıcının kullanıcı adı"
 *                  email:
 *                    type: string
 *                    description: "Kullanıcının e-posta adresi"
 *              example:
 *                - username: "john_doe"
 *                  email: "john@example.com"
 *                - username: "jane_doe"
 *                  email: "jane@example.com"
 */

apiController.post(`/users/`, async (req, res, next) => {
  try {
    const userlist = req.body.usernames;
    const users = await ApiService.getAllUsers(userlist);
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
 *      '200':
 *        description: "Başarılı işlem"
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    description: "Kullanıcının kullanıcı adı"
 *                  url:
 *                    type: string
 *                    description: "Kullanıcının URL'si"
 *                  uuid:
 *                    type: string
 *                    description: "Kullanıcının UUID'si"
 */
apiController.post(`/user_urls/`, async (req, res, next) => {
  try {
    const userlist = req.body.usernames;
    const users = await ApiService.getAllUsers(userlist);
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
 * /api/uniqueusers/{uuid}:
 *   get:
 *     tags:
 *      - api
 *     summary: "rastgele 1000 kullanıcı verir."
 *     description: "2 tane büyük işlem içerdiği için uzun sürer!"
 */
apiController.get(`/uniqueusers/`, async (req, res, next) => {
  try {
    const usersnames = await ApiService.getUniqueNames(1000);
    const userlist = usersnames.map((user) => user.username);

    const users = await ApiService.getAllUsers(userlist);
    const response = users.map((user) => {
      return {
        url: req.hostname + req.url + `/${user.username}`,
        base64: user.image.toString("base64"),
      };
    });

    res.send({
      success: true,
      message: "rastgele uyeler alindi!",
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
 * /api/getrandomusernames:
 *  get:
 *    tags:
 *      - api
 *    summary: "rastgele 1000 kullanici adi verir"
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

export default apiController;
