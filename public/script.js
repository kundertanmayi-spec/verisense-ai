async function analyze() {
  const textInput = document.getElementById("text").value;
  if (!textInput.trim()) {
    alert("Please enter some text to analyze.");
    return;
  }

  const analyzeBtn = document.getElementById("analyze-btn");
  const spinner = document.getElementById("spinner");
  const btnText = document.querySelector(".btn-text");
  
  // Show loading state
  analyzeBtn.disabled = true;
  spinner.classList.remove("hidden");
  btnText.innerText = "Analyzing...";

  try {
    const res = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: textInput }),
    });

    const data = await res.json();
    const resultObj = JSON.parse(data.result);
    
    renderResults(resultObj);
  } catch (err) {
    alert("Failed to connect to the server. Make sure it's running!");
    console.error(err);
  } finally {
    // Reset button state
    analyzeBtn.disabled = false;
    spinner.classList.add("hidden");
    btnText.innerText = "Analyze Text";
  }
}

function renderResults(data) {
  document.getElementById("results-container").classList.remove("hidden");

  // Colors based on risk
  const colors = {
    "LOW": "#10b981", // green
    "MEDIUM": "#f59e0b", // yellow
    "HIGH": "#ef4444" // red
  };

  const riskColor = colors[data.risk] || colors["LOW"];

  // Update Score & Progress
  const scoreText = document.getElementById("score-text");
  const progressCircle = document.getElementById("circular-progress");
  
  // Animate score 0 to final
  let currentScore = 0;
  const targetScore = data.score;
  const interval = setInterval(() => {
    if (currentScore >= targetScore) {
      clearInterval(interval);
      scoreText.innerText = targetScore;
      progressCircle.style.background = `conic-gradient(${riskColor} ${targetScore * 3.6}deg, var(--bg-tertiary) 0deg)`;
    } else {
      currentScore++;
      scoreText.innerText = currentScore;
      progressCircle.style.background = `conic-gradient(${riskColor} ${currentScore * 3.6}deg, var(--bg-tertiary) 0deg)`;
    }
  }, 15);

  // Update Badge
  const badge = document.getElementById("risk-badge");
  badge.innerText = `${data.risk} RISK`;
  badge.style.background = `${riskColor}33`; // 20% opacity
  badge.style.color = riskColor;
  badge.style.border = `1px solid ${riskColor}`;

  // Update Overall Explanation
  document.getElementById("overall-explanation").innerText = data.explanation;

  // Render Sentences
  const sentencesList = document.getElementById("sentences-list");
  sentencesList.innerHTML = "";

  data.sentences.forEach((sentence, index) => {
    const sentenceDiv = document.createElement("div");
    sentenceDiv.className = `sentence-item ${sentence.risky ? 'risky' : ''}`;
    
    // Highlight risky text
    let displayedText = sentence.text;
    if (sentence.risky) {
      displayedText = `<span class="highlight">${sentence.text}</span>`;
    }

    sentenceDiv.innerHTML = `
      <div class="sentence-text">${displayedText}</div>
      <button class="why-btn" onclick="toggleWhy(${index})">Why?</button>
      <div class="why-explanation hidden" id="why-${index}">${sentence.why}</div>
    `;
    
    sentencesList.appendChild(sentenceDiv);
  });
}

function toggleWhy(index) {
  const whyDiv = document.getElementById(`why-${index}`);
  if (whyDiv.classList.contains("hidden")) {
    whyDiv.classList.remove("hidden");
  } else {
    whyDiv.classList.add("hidden");
  }
}
