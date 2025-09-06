
import express from "express";
import {
  createQuiz,
  generateQuiz,
  getQuizzes,
  submitQuiz,
  getInstitutionResults,
} from "../controllers/quiz.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/", authMiddleware, createQuiz);
router.post("/generate", authMiddleware, generateQuiz);
router.get("/", authMiddleware, getQuizzes);
router.post("/submit", authMiddleware, submitQuiz);
router.get("/results", authMiddleware, getInstitutionResults);
export default router;
