
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();
async function testGemini() {
  try {
    console.log("Gemini Key:", process.env.GEMINI_API_KEY); // Debugging
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Generate one multiple-choice question about disasters in JSON format.";
    const result = await model.generateContent(prompt);
    console.log("Response:", result.response.text());
  } catch (err) {
    console.error("Gemini test failed:", err);
  }
}

testGemini();
