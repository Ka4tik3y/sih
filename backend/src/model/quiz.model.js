import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: function (options) {
          return options.some((opt) => opt.isCorrect);
        },
        message: "At least one option must be marked correct.",
      },
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["earthquake", "flood", "fire", "general"],
      default: "general",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
