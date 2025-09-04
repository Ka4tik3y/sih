import express from "express";
import {
  createQuiz,
  getQuizzes,
  submitQuiz,
} from "../controllers/quiz.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, createQuiz);
router.get("/", authMiddleware, getQuizzes);
router.post("/submit", authMiddleware, submitQuiz);

export default router;
