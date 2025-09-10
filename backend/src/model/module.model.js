import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  fileUrl: { type: String, required: true }, // PDF path
  createdAt: { type: Date, default: Date.now }
});

const Module = mongoose.model("Module", moduleSchema);
export default Module;
