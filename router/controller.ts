import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/v", (req, res) => {
  res.send("World!");
});

export default router;
