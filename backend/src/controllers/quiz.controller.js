import Quiz from "../model/quiz.model.js";
import QuizAttempt from "../model/quizAttempt.model.js";


export const createQuiz = async (req, res) => {
  try {
    if (req.role !== "staff" && req.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only staff/admin can create quizzes" });
    }

    const { title, description, category, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Title and at least one question required" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      category,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select(
      "title description category createdAt"
    );
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    if (req.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can attempt quizzes" });
    }

    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    const processedAnswers = quiz.questions.map((q, index) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === q._id.toString()
      );

      if (!studentAnswer) {
        return {
          questionId: q._id,
          selectedOption: null,
          isCorrect: false,
        };
      }

      const correctOption = q.options.find((opt) => opt.isCorrect);

      const isCorrect = studentAnswer.selectedOption === correctOption.text;
      if (isCorrect) score++;

      return {
        questionId: q._id,
        selectedOption: studentAnswer.selectedOption,
        isCorrect,
      };
    });

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quizId,
      answers: processedAnswers,
      score,
    });

    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      score,
      total: quiz.questions.length,
      attempt,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
