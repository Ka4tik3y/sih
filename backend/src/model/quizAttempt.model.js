import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
export default QuizAttempt;
