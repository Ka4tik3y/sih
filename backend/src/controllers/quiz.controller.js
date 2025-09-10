import Quiz from "../model/quiz.model.js";
import QuizAttempt from "../model/quizAttempt.model.js";
import Student from "../model/student.model.js";
import Module from "../model/module.model.js"; 
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
    res.status(500).json({ message: "Error generating quiz", error: err.message });
  }
};
export const generateQuizFromModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const numQuestions = req.body.numQuestions || 5;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (!module.category) {
      return res.status(400).json({ message: "Module has no category" });
    }

    const prompt = `
      Generate ${numQuestions} multiple-choice questions about "${module.category}".
      Return JSON only in this format:
      [
        {
          "text": "Question here?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A"
        }
      ]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    let raw = result.response.text().trim();
    console.log("AI raw output:", raw);

    if (raw.startsWith("```")) {
      raw = raw.replace(/```json|```/g, "").trim();
    }

    let quizData;
    try {
      quizData = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse failed:", e);
      return res.status(500).json({
        success: false,
        message: "Invalid AI response",
        raw,
      });
    }

    if (!Array.isArray(quizData) || quizData.length === 0) {
      return res.status(500).json({ success: false, message: "No valid questions generated" });
    }

    quizData = quizData.map((q) => ({
      text: q.text || "Untitled question",
      options: Array.isArray(q.options) ? q.options : ["A", "B", "C", "D"],
      correctAnswer: q.correctAnswer && Array.isArray(q.options)
  ? q.options.find(opt => opt.startsWith(q.correctAnswer)) || q.options[0]
  : q.options?.[0]
 || "A",
    }));

    const quiz = new Quiz({
      title: `${module.title} Quiz`,
      category: module.category,
      createdBy: req.user._id,
      questions: quizData,
    });
    await quiz.save();
    res.status(201).json({
      success: true,
      quizzes: quiz.questions,
      quizId: quiz._id,
    });
  } catch (err) {
    console.error("Gemini module-based quiz generation failed:", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: "Error generating quiz from module", error: err.message });
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
      console.log("Evaluating:", { question: q.text, selected, correct: q.correctAnswer });
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
      .populate("student", "fullName email")
      .populate("quiz", "title category questions");

    if (!attempts.length) {
      return res.json({
        success: true,
        message: "No attempts yet for this institution",
        institution: staff.institution,
        totalAttempts: 0,
        avgScore: 0,
        distribution: { high: 0, medium: 0, low: 0 },
        results: [],
      });
    }

    const totalAttempts = attempts.length;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const avgScore = (totalScore / totalAttempts).toFixed(2);

    const distribution = { high: 0, medium: 0, low: 0 };

    const results = attempts.map((a) => {
      const percentage = (a.score / a.quiz.questions.length) * 100;
      let level = "Low";
      if (percentage >= 80) level = "High";
      else if (percentage >= 50) level = "Medium";

      distribution[level.toLowerCase()]++;

      return {
        student: a.student.fullName,
        email: a.student.email,
        quiz: a.quiz.title,
        category: a.quiz.category,
        score: a.score,
        percentage: percentage.toFixed(2),
        level,
      };
    });

    res.json({
      success: true,
      institution: staff.institution,
      totalAttempts,
      avgScore,
      distribution,
      results,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching institution analytics",
      error: err.message,
    });
  }
};
