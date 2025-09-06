
import Quiz from "../model/quiz.model.js";
import QuizAttempt from "../model/quizAttempt.model.js";
import Student from "../model/student.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createQuiz = async (req, res) => {
  try {
    const { title, category, questions } = req.body;
    if (!title || !category || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid quiz data" });
    }
    const quiz = new Quiz({
      title,
      category,
      createdBy: req.user._id,
      questions,
    });
    await quiz.save();
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ message: "Error creating quiz", error: err.message });
  }
};

export const generateQuiz = async (req, res) => {
  try {
    const { category, numQuestions = 5 } = req.body;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Generate ${numQuestions} multiple-choice questions about ${category}.
      Return JSON only in this format:
      [
        {
          "text": "Question here?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A"
        }
      ]
    `;
    const result = await model.generateContent(prompt);
    let raw = result.response.text().trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/```json|```/g, "").trim();
    }
    const quizData = JSON.parse(raw);
    const quiz = new Quiz({
      title: `${category} Quiz`,
      category,
      createdBy: req.user._id,
      questions: quizData,
    });
    await quiz.save();
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    console.error("Gemini quiz generation failed:", err);
    res
      .status(500)
      .json({ message: "Error generating quiz", error: err.message });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("title category questions");
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    let score = 0;
    const evaluated = quiz.questions.map((q, idx) => {
      const userAnswer = answers.find((a) => a.questionIndex === idx);
      const selected = userAnswer ? userAnswer.selected : null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score++;
      return { question: q.text, selected, isCorrect };
    });
    const attempt = new QuizAttempt({
      student: req.user._id,
      quiz: quizId,
      answers: evaluated,
      score,
    });
    await attempt.save();
    res.json({ success: true, score, attempt });
  } catch (err) {
    res.status(500).json({ message: "Error submitting quiz", error: err.message });
  }
};

export const getInstitutionResults = async (req, res) => {
  try {
    const staff = req.user; 
    const students = await Student.find({ institution: staff.institution });
    const studentIds = students.map((s) => s._id);
    const attempts = await QuizAttempt.find({ student: { $in: studentIds } })
      .populate("student", "fullName email institution")
      .populate("quiz", "title category");
    res.json({ success: true, attempts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching results", error: err.message });
  }
};
