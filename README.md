# 🧠 VeriSense AI — Hallucination Detector

VeriSense AI is a professional-grade, high-performance tool designed to detect hallucinations in AI-generated text. Built with a sleek, modern dashboard and powered by Google's advanced Gemini models, it provides real-time analysis, factual grounding via Wikipedia, and actionable insights.

## 🚀 Key Features

- **Gemini-Powered Analysis**: High-accuracy reasoning using Google Gemini 1.5 Pro/Flash models.
- **Factual Corrections**: Not just flags errors, but provides the **correct factual statement** for every detected hallucination.
- **Wikipedia Grounding**: Real-time cross-referencing of claims with live Wikipedia data.
- **System Insights**: A dedicated analytics dashboard showing hallucination rates and risk distribution.
- **Persistent History**: Automatically save and review your past analyses with local storage persistence.
- **Saved Reports**: Bookmark critical findings for quick access in a dedicated section.
- **Customizable Settings**: Switch between different AI models (Flash vs Pro) and toggle auto-save preferences.
- **Robust Fallback**: Smart auto-recovery using Wikipedia factual checks if the AI service is unavailable.
- **Modern UI**: Premium two-column dashboard with glassmorphism, light/dark themes, and smooth animations.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+), Lucide Icons
- **AI Engine**: Google Generative AI (Gemini API)
- **Data Source**: Wikipedia API Integration
- **Styling**: Modern CSS Variables, Flexbox, and Grid (No heavy frameworks)
- **Deployment**: Configured for Vercel

## ⚙️ How It Works

1.  **Input**: Enter AI-generated text into the premium editor.
2.  **Multi-Model Analysis**: The system sends the text to the backend, prioritizing your selected Gemini model.
3.  **Factual Scrutiny**: The AI breaks down text into sentences, identifies potential hallucinations, and generates Wikipedia search queries.
4.  **Real-time Verification**: The backend fetches live summaries from Wikipedia to cross-reference the AI's claims.
5.  **Structured Correction**: The system returns a comprehensive JSON including risk scores, reasoning, and corrected facts.
6.  **Interactive Rendering**: Results are displayed with color-coded risk levels, clickable source links, and expandable explanation boxes.

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
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    GOOGLE_API_KEY=your_actual_api_key_here
    PORT=3000
    ```

4.  **Run the application**:
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000`.

## 🌐 Deployment

This project is pre-configured for **Vercel**. 
1. Connect your GitHub repository to Vercel.
2. Add your `GOOGLE_API_KEY` as an environment variable in the Vercel dashboard.
3. Deploy!

---
Built with ❤️ for AI Factual Integrity.
