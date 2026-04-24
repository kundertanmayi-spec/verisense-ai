// Examples data
const examples = [
  "The moon is made of green cheese.",
  "The Great Wall of China is visible from space.",
  "Humans use only 10% of their brain."
];

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  document.documentElement.setAttribute("data-theme", isLight ? "dark" : "light");
  
  // Update icon
  themeToggle.innerHTML = isLight ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  lucide.createIcons();
});

// Initialize character count
const textarea = document.getElementById("text");
const charCount = document.getElementById("current-count");

textarea.addEventListener("input", () => {
  const count = textarea.value.length;
  charCount.innerText = count;
});

function useExample(index) {
  textarea.value = examples[index];
  charCount.innerText = textarea.value.length;
  analyze(); // Automatically start analysis
}

function clearText() {
  textarea.value = "";
  charCount.innerText = "0";
}

// History Management
let history = JSON.parse(localStorage.getItem("verisense_history") || "[]");

function saveToHistory(text, result) {
  const item = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    text: text,
    result: result
  };
  history.unshift(item);
  if (history.length > 50) history.pop(); // Keep last 50
  localStorage.setItem("verisense_history", JSON.stringify(history));
}

function showSection(sectionId) {
  const analyzerView = document.getElementById("analyzer-view");
  const historyView = document.getElementById("history-view");
  const insightsView = document.getElementById("insights-view");
  const savedView = document.getElementById("saved-view");
  const settingsView = document.getElementById("settings-view");
  const navAnalyzer = document.getElementById("nav-analyzer");
  const navHistory = document.getElementById("nav-history");
  const navInsights = document.getElementById("nav-insights");
  const navSaved = document.getElementById("nav-saved");
  const navSettings = document.getElementById("nav-settings");

  // Reset active states
  [navAnalyzer, navHistory, navInsights, navSaved, navSettings].forEach(n => n.classList.remove("active"));
  [analyzerView, historyView, insightsView, savedView, settingsView].forEach(v => v.classList.add("hidden"));

  if (sectionId === "analyzer") {
    analyzerView.classList.remove("hidden");
    navAnalyzer.classList.add("active");
  } else if (sectionId === "history") {
    historyView.classList.remove("hidden");
    navHistory.classList.add("active");
    renderHistory();
  } else if (sectionId === "insights") {
    insightsView.classList.remove("hidden");
    navInsights.classList.add("active");
    renderInsights();
  } else if (sectionId === "saved") {
    savedView.classList.remove("hidden");
    navSaved.classList.add("active");
    renderSavedReports();
  } else if (sectionId === "settings") {
    settingsView.classList.remove("hidden");
    navSettings.classList.add("active");
  }
}

function clearAllData() {
  if (confirm("Are you sure you want to clear all history and saved reports? This cannot be undone.")) {
    localStorage.removeItem("verisense_history");
    localStorage.removeItem("verisense_saved");
    history = [];
    savedReports = [];
    alert("All data cleared successfully.");
    showSection("analyzer");
  }
}

// Saved Reports Management
let savedReports = JSON.parse(localStorage.getItem("verisense_saved") || "[]");

function saveCurrentReport() {
  if (!currentAnalysisData) return;
  
  const alreadySaved = savedReports.find(r => r.timestamp === currentAnalysisData.timestamp);
  if (alreadySaved) {
    alert("This report is already saved!");
    return;
  }

  savedReports.unshift({
    timestamp: Date.now(),
    text: textarea.value,
    result: currentAnalysisData
  });
  
  localStorage.setItem("verisense_saved", JSON.stringify(savedReports));
  alert("Report bookmarked successfully!");
}

function renderSavedReports() {
  const list = document.getElementById("saved-list");
  list.innerHTML = "";

  if (savedReports.length === 0) {
    list.innerHTML = '<div class="empty-history">No saved reports yet. Bookmark an analysis to see it here!</div>';
    return;
  }

  savedReports.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.onclick = () => {
      textarea.value = item.text;
      renderResults(item.result);
      showSection("analyzer");
    };

    const date = new Date(item.timestamp).toLocaleDateString();
    const riskClass = item.result.risk.toLowerCase();

    div.innerHTML = `
      <div class="history-item-info">
        <div class="history-item-text">${item.text}</div>
        <div class="history-item-meta">
          <span>${date}</span>
          <span class="history-item-risk ${riskClass}">${item.result.risk}</span>
          <span>${item.result.score}% Risk</span>
        </div>
      </div>
      <div class="history-actions">
        <button class="delete-btn" onclick="deleteSavedReport(event, ${index})"><i data-lucide="trash-2"></i></button>
      </div>
    `;
    list.appendChild(div);
  });
  lucide.createIcons();
}

function deleteSavedReport(e, index) {
  e.stopPropagation();
  savedReports.splice(index, 1);
  localStorage.setItem("verisense_saved", JSON.stringify(savedReports));
  renderSavedReports();
}

function renderInsights() {
  if (history.length === 0) return;

  const total = history.length;
  const highRisk = history.filter(h => h.result.risk === "HIGH").length;
  const mediumRisk = history.filter(h => h.result.risk === "MEDIUM").length;
  const lowRisk = history.filter(h => h.result.risk === "LOW").length;
  
  const avgScore = Math.round(history.reduce((acc, h) => acc + h.result.score, 0) / total);
  const hallucinationRate = Math.round(((highRisk + mediumRisk) / total) * 100);

  // Update Stats
  document.getElementById("stat-total").innerText = total;
  document.getElementById("stat-hallucinations").innerText = `${hallucinationRate}%`;
  document.getElementById("stat-avg-score").innerText = `${avgScore}%`;

  // Update Distribution Bars
  updateDistBar("high", highRisk, total);
  updateDistBar("medium", mediumRisk, total);
  updateDistBar("low", lowRisk, total);
}

function updateDistBar(id, count, total) {
  const pct = Math.round((count / total) * 100);
  document.getElementById(`dist-${id}`).style.width = `${pct}%`;
  document.getElementById(`dist-${id}-pct`).innerText = `${pct}%`;
}

function renderHistory() {
  const historyList = document.getElementById("history-list");
  if (history.length === 0) {
    historyList.innerHTML = '<div class="empty-history">No history found. Start analyzing text to see it here!</div>';
    return;
  }

  historyList.innerHTML = history.map(item => `
    <div class="history-item" onclick="loadHistoryItem(${item.id})">
      <div class="history-item-info">
        <div class="history-item-text">${item.text}</div>
        <div class="history-item-meta">
          <span>${new Date(item.timestamp).toLocaleString()}</span>
          <span>Score: ${item.result.score}%</span>
        </div>
      </div>
      <div class="history-actions">
        <div class="history-item-risk ${item.result.risk.toLowerCase()}">${item.result.risk} RISK</div>
        <button class="delete-btn" onclick="deleteHistoryItem(${item.id}, event)"><i data-lucide="trash-2"></i></button>
      </div>
    </div>
  `).join("");
  
  lucide.createIcons();
}

function deleteHistoryItem(id, event) {
  event.stopPropagation(); // Prevent loading the item
  history = history.filter(h => h.id !== id);
  localStorage.setItem("verisense_history", JSON.stringify(history));
  renderHistory();
}

function loadHistoryItem(id) {
  const item = history.find(h => h.id === id);
  if (item) {
    textarea.value = item.text;
    charCount.innerText = item.text.length;
    showSection("analyzer");
    renderResults(item.result);
  }
}

async function analyze() {
  const textInput = textarea.value;
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
    const model = document.getElementById("model-select").value;
    const res = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: textInput, model }),
    });

    const data = await res.json();
    const resultObj = JSON.parse(data.result);
    
    saveToHistory(textInput, resultObj);
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

// Global state for current analysis
let currentAnalysisData = null;

function renderResults(data) {
  currentAnalysisData = data;
  document.getElementById("results-placeholder").classList.add("hidden");
  document.getElementById("results-container").classList.remove("hidden");

  // Defensive check for old/new format
  const score = data.accuracy_score !== undefined ? data.accuracy_score : (data.score !== undefined ? (100 - data.score) : 0);
  const label = data.accuracy_label || data.risk || "UNKNOWN";

  // Colors based on Accuracy Score
  let accuracyColor = "#ef4444"; // Red (Incorrect)
  if (score >= 80) accuracyColor = "#10b981"; // Green (Correct)
  else if (score >= 40) accuracyColor = "#f59e0b"; // Orange (Partial)

  // Update Score & Label
  const levelEl = document.getElementById("accuracy-level");
  const scoreText = document.getElementById("score-text");
  const descEl = document.getElementById("accuracy-description");

  levelEl.innerText = label;
  levelEl.style.color = accuracyColor;
  scoreText.innerText = score;
  
  if (score >= 80) descEl.innerText = "This statement is factually verified and reliable.";
  else if (score >= 40) descEl.innerText = "This statement contains partial truths or unverified claims.";
  else descEl.innerText = "This statement is highly likely to be incorrect or hallucinated.";

  // Circular Progress
  const progress = document.getElementById("circular-progress");
  progress.style.background = `conic-gradient(${accuracyColor} ${score * 3.6}deg, var(--bg-tertiary) 0deg)`;

  // Calculate Breakdown
  const counts = { high: 0, medium: 0, low: 0 };
  data.sentences.forEach(s => {
    const sScore = s.accuracy !== undefined ? s.accuracy : 50;
    if (sScore >= 80) counts.high++;
    else if (sScore >= 40) counts.medium++;
    else counts.low++;
  });

  updateBreakdown("high", counts.high, data.sentences.length);
  updateBreakdown("medium", counts.medium, data.sentences.length);
  updateBreakdown("low", counts.low, data.sentences.length);

  // Update Overall Explanation
  document.getElementById("overall-explanation").innerText = data.explanation;

  // Render Sentences
  const sentencesList = document.getElementById("sentences-list");
  sentencesList.innerHTML = "";

  data.sentences.forEach((sentence, index) => {
    const sentenceDiv = document.createElement("div");
    sentenceDiv.className = "finding-item";
    
    const sScore = sentence.accuracy !== undefined ? sentence.accuracy : 50;
    
    let icon = "alert-triangle";
    let colorClass = "high"; // We use 'high' class for red in CSS
    if (sScore >= 80) { icon = "check-circle"; colorClass = "low"; } // 'low' class for green
    else if (sScore >= 40) { icon = "alert-circle"; colorClass = "medium"; }

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(sentence.text)}`;

    sentenceDiv.innerHTML = `
      <div class="finding-status ${colorClass}"><i data-lucide="${icon}"></i></div>
      <div class="finding-content">
        <div class="finding-text">${sentence.text} <span class="accuracy-pill ${colorClass}">${sScore}%</span></div>
        <div class="finding-subtext">${sentence.why}</div>
        
        ${sentence.corrected_fact ? `
          <div class="correction-box">
            <i data-lucide="check-circle-2"></i>
            <div class="correction-info">
              <span class="correction-label">Correct Fact</span>
              <p>${sentence.corrected_fact}</p>
            </div>
          </div>
        ` : ""}

        <div class="finding-actions">
          <button class="why-btn-small" onclick="toggleWhy(${index})">Why?</button>
          <a href="${googleSearchUrl}" target="_blank" class="platform-link google-link"><i data-lucide="search"></i> Google</a>
          ${sentence.wiki ? `<a href="${sentence.wiki.url}" target="_blank" class="platform-link wiki-link-badge"><i data-lucide="globe"></i> Wiki</a>` : ""}
        </div>
        <div id="why-${index}" class="why-explanation-box hidden">
          <p><strong>Verification Details:</strong> ${sentence.wiki ? sentence.wiki.extract : 'Fact-checked against available knowledge bases.'}</p>
        </div>
      </div>
    `;
    
    sentencesList.appendChild(sentenceDiv);
  });

  // Update Sources
  const sourcesList = document.getElementById("sources-list");
  sourcesList.innerHTML = "";
  const uniqueSources = new Map();
  data.sentences.forEach(s => {
    if (s.wiki) uniqueSources.set(s.wiki.title, s.wiki.url);
  });

  if (uniqueSources.size === 0) {
    const generalSources = [
      { name: "Google Search", url: "https://www.google.com" },
      { name: "Wikipedia", url: "https://www.wikipedia.org" },
      { name: "Britannica", url: "https://www.britannica.com" }
    ];
    generalSources.forEach(source => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${source.url}" target="_blank" class="source-link"><i data-lucide="external-link"></i> ${source.name}</a>`;
      sourcesList.appendChild(li);
    });
  } else {
    uniqueSources.forEach((url, title) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${url}" target="_blank" class="source-link"><i data-lucide="book-open"></i> ${title}</a>`;
      sourcesList.appendChild(li);
    });
  }

  // Re-run Lucide
  lucide.createIcons();
}

function updateBreakdown(id, count, total) {
  const countEl = document.getElementById(`count-${id}`);
  const barEl = document.getElementById(`bar-${id}`);
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  countEl.innerText = count;
  barEl.style.width = `${percentage}%`;
}

function toggleWhy(index) {
  const whyDiv = document.getElementById(`why-${index}`);
  whyDiv.classList.toggle("hidden");
}

function downloadReport() {
  if (!currentAnalysisData) return;

  const data = currentAnalysisData;
  let report = `VeriSense AI - Analysis Report\n`;
  report += `====================================\n`;
  report += `Date: ${new Date().toLocaleString()}\n`;
  report += `Overall Risk: ${data.risk}\n`;
  report += `Risk Score: ${data.score}%\n\n`;
  report += `Overall Analysis:\n${data.explanation}\n\n`;
  report += `Sentence Breakdown:\n`;
  report += `------------------------------------\n`;

  data.sentences.forEach((s, i) => {
    report += `${i + 1}. [${s.risky ? 'RISKY' : 'RELIABLE'}] ${s.text}\n`;
    report += `   Why: ${s.why}\n`;
    if (s.wiki) {
      report += `   Source: ${s.wiki.url}\n`;
    }
    report += `\n`;
  });

  report += `\n====================================\n`;
  report += `Generated by VeriSense AI`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VeriSense_Report_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

async function shareResult() {
  if (!currentAnalysisData) return;

  const data = currentAnalysisData;
  const shareText = `VeriSense AI Analysis:\nRisk Level: ${data.risk}\nRisk Score: ${data.score}%\n\nExplanation: ${data.explanation.substring(0, 100)}...`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'VeriSense AI Analysis Report',
        text: shareText,
        url: window.location.href
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  } else {
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Analysis summary copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard.');
    }
  }
}

function toggleAbout() {
  const modal = document.getElementById("about-modal");
  modal.classList.toggle("hidden");
}
