import Module from "../model/module.model.js";
// import Quiz from "../model/quiz.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import fs from "fs";
// import pdfParse from "pdf-parse"; 

export const createModule = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }
    const newModule = new Module({
      title,
      category,
      fileUrl: `/uploads/${req.file.filename}`, 
    });
    await newModule.save();
    res.status(201).json({
      message: "Module uploaded successfully",
      module: newModule,
    });
  } catch (error) {
    console.error("Error uploading module:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // Generate quiz for a module
// export const generateQuizFromModule = async (req, res) => {
//   try {
//     const { moduleId, numQuestions = 5 } = req.body;
//     const module = await Module.findById(moduleId);
//     if (!module) return res.status(404).json({ message: "Module not found" });

//     // Try extracting text from PDF
//     const fileBuffer = fs.readFileSync(`.${module.fileUrl}`);
//     let pdfText = "";
//     try {
//       const data = await pdfParse(fileBuffer);
//       pdfText = data.text.slice(0, 3000); // limit input size
//     } catch (err) {
//       console.warn("PDF parsing failed, falling back to category:", err.message);
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = `
//       Based on this disaster management training content:
//       "${pdfText || module.category}"
//       Generate ${numQuestions} multiple-choice questions.
//       Return JSON in this format only:
//       [
//         { "text": "Question here?", "options": ["A", "B", "C", "D"], "correctAnswer": "A" }
//       ]
//     `;

//     const result = await model.generateContent(prompt);
//     let raw = result.response.text().trim();
//     if (raw.startsWith("```")) raw = raw.replace(/```json|```/g, "").trim();

//     const quizData = JSON.parse(raw);

//     const quiz = new Quiz({
//       title: `${module.title} Quiz`,
//       category: module.category,
//       createdBy: req.user._id,
//       questions: quizData,
//     });
//     await quiz.save();

//     // Link quiz to module
//     module.quizzes.push(quiz._id);
//     await module.save();

//     res.status(201).json({ success: true, quiz });
//   } catch (err) {
//     console.error("Quiz generation failed:", err);
//     res.status(500).json({ message: "Error generating quiz", error: err.message });
//   }
// };
