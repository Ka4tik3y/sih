import express from "express";
import multer from "multer";
import { createModule, getModules } from "../controllers/module.controller.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
router.post("/", upload.single("file"), createModule);
router.get("/", getModules);

export default router;
