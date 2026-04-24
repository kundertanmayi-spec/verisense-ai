# 🧠 VeriSense AI — Hallucination Detector

VeriSense AI is a premium, high-performance tool designed to detect hallucinations in AI-generated text. Built with a sleek, modern dark-mode interface and powered by OpenAI's advanced models, it provides real-time analysis to ensure information accuracy.

## 🚀 Features

- **Real-time Analysis**: Instant feedback on text accuracy.
- **Risk Assessment**: Categorizes results into Low, Medium, and High risk levels.
- **Visual Indicators**: Interactive confidence bars and risk badges.
- **Modern UI**: Premium dark-mode design with glassmorphism and smooth animations.
- **Detailed Explanations**: Understand *why* certain parts of the text might be hallucinations.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+)
- **AI Engine**: OpenAI API (GPT-4o)
- **Styling**: Custom CSS with CSS Variables, Flexbox, and Grid
- **Deployment**: Configured for Vercel

## ⚙️ How It Works

1.  **Input**: The user enters AI-generated text into the textarea.
2.  **Analysis Request**: The frontend sends a POST request to the `/analyze` endpoint of the backend server.
3.  **AI Evaluation**: The backend uses the OpenAI API with a specialized prompt to scrutinize the input for factual inconsistencies or common hallucination patterns.
4.  **Structured Response**: The server returns a JSON object containing:
    -   `riskLevel`: (Low, Medium, or High)
    -   `confidenceScore`: A percentage representing the model's certainty.
    -   `explanation`: A detailed breakdown of the findings.
5.  **Dynamic Rendering**: The frontend dynamically updates the UI to show the results with animated badges and progress bars.

## 📦 Local Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/kundertanmayi-spec/verisense-ai.git
    cd verisense-ai
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=your_actual_api_key_here
    PORT=3000
    ```

4.  **Run the application**:
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000`.

## 🌐 Deployment

This project is pre-configured for **Vercel**. Simply connect your GitHub repository to Vercel, add your `OPENAI_API_KEY` as an environment variable in the Vercel dashboard, and deploy.

---
Built with ❤️ for AI Accuracy.
