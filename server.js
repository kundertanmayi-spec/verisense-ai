import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    // Phase 8 fake demo fallback if API fails
    let useFallback = false;
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("***")) {
      useFallback = true;
    }

    if (useFallback) {
      // Fake response
      return res.json({
        result: JSON.stringify({
          risk: "MEDIUM",
          score: 65,
          explanation: "This text contains generally accurate information but lacks specific verifiable details in some sentences.",
          sentences: [
            { text: "This is a generally accurate statement.", risky: false, why: "Common knowledge." },
            { text: "However, the AI hallucinated this completely fake detail.", risky: true, why: "This claim is entirely fabricated and cannot be verified." }
          ]
        })
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Updated to actual valid model
      messages: [
        {
          role: "system",
          content:
            "You are an AI hallucination detector. Analyze the following text. You MUST return your analysis as a strict JSON object. The JSON must contain: 'risk' (LOW/MEDIUM/HIGH), 'score' (number from 0-100), 'explanation' (overall reasoning), and 'sentences' (an array of objects, where each object has 'text' (the sentence), 'risky' (boolean), and 'why' (explanation of risk for that sentence)).",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" }
    });

    res.json({
      result: response.choices[0].message.content,
    });
  } catch (err) {
    console.error("API Error:", err.message);
    // Fake demo fallback if API throws error (e.g. invalid key)
    return res.json({
      result: JSON.stringify({
        risk: "HIGH",
        score: 80,
        explanation: "API Failed. Showing demo fallback data. This text seems highly speculative.",
        sentences: [
          { text: "The API failed to respond.", risky: true, why: "Network or Auth Error." },
          { text: "This is a placeholder for demonstration purposes.", risky: false, why: "This is demonstrably true." }
        ]
      })
    });
  }
});

// Export for Vercel serverless functions
export default app;

if (!process.env.VERCEL) {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}
