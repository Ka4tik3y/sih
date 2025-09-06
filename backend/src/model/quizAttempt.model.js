
import mongoose from "mongoose";
const answerSchema = new mongoose.Schema({
  question: String, 
  selected: String, 
  isCorrect: Boolean,
});   
const quizAttemptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [answerSchema],
    score: { type: Number, required: true },
  },
  { timestamps: true }
);
export default mongoose.model("QuizAttempt", quizAttemptSchema);
