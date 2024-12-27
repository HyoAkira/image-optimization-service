import express from "express";
import userController from "../services/user/user.controller";
import apiController from "@/services/api/api.controller";
const router = express.Router();

router.use("/users", userController);
router.use("/api", apiController);

export default router;
