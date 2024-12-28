import express from "express";
import userController from "../services/user/user.controller";
import apiController from "@/services/api/api.controller";
import corsValidaton from "@/middlewares/corsValidation";
import cors from "cors";

const router = express.Router();

router.use("/users", userController);
router.use("/api", cors(corsValidaton), apiController);

export default router;
