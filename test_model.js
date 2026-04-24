import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Model initialized successfully");
  } catch (err) {
    console.error("Error initializing model:", err.message);
  }
}

listModels();
