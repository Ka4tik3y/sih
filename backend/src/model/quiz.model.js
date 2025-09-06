
import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }, 
});
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);
export default mongoose.model("Quiz", quizSchema);
