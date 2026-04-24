import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash"
});

async function getWikiSummary(title) {
  if (!title) return null;
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      title: data.title,
      extract: data.extract,
      url: data.content_urls.desktop.page
    };
  } catch (err) {
    return null;
  }
}

function cleanJsonResponse(text) {
  // Remove markdown backticks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is missing");
    }

    const prompt = `
      Analyze the following text for factual accuracy and hallucinations.
      Text: "${text}"
      
      Return a JSON object with:
      "risk": "LOW", "MEDIUM", or "HIGH"
      "score": 0-100 (risk percentage)
      "explanation": "Overall reasoning"
      "sentences": [
        {
          "text": "original sentence",
          "risky": true/false,
          "why": "explanation",
          "wiki_query": "topic for wikipedia verification"
        }
      ]
      
      Respond ONLY with the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    const cleanedText = cleanJsonResponse(rawText);
    
    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr.message, "Raw Text:", rawText);
      throw new Error("Invalid response format from AI");
    }

    // Fetch Wikipedia summaries for each sentence
    for (let sentence of analysis.sentences) {
      if (sentence.wiki_query) {
        sentence.wiki = await getWikiSummary(sentence.wiki_query);
      }
    }

    res.json({
      result: JSON.stringify(analysis),
    });
  } catch (err) {
    console.error("Analysis Error:", err.message);
    
    // Fallback if Gemini fails
    return res.json({
      result: JSON.stringify({
        risk: "HIGH",
        score: 95,
        explanation: `Analysis failed: ${err.message}. Please check your API key and connection.`,
        sentences: [
          { text: text, risky: true, why: "System error occurred during analysis." }
        ]
      })
    });
  }
});

// Export for Vercel serverless functions
export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
