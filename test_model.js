import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function testV1() {
  console.log("Testing v1 API...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });
    const result = await model.generateContent("test");
    console.log("V1 Result:", await result.response.text());
  } catch (err) {
    console.error("V1 Error:", err.message);
  }
}

testV1();
