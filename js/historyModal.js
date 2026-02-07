const historyBtn = document.getElementById("historyBtn");
const historyOverlay = document.getElementById("historyOverlay");
const historyContent = document.getElementById("historyContent");
const closeHistory = document.getElementById("closeHistory");

historyBtn.onclick = openHistory;
closeHistory.onclick = closeHistoryModal;

// click gia na kleisei to modal an paththei ektos tou content
historyOverlay.onclick = e => {
  if (e.target === historyOverlay) closeHistoryModal();
};

function openHistory() {
  historyContent.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("dailyHistory")) || {};

  const dates = Object.keys(history).sort().reverse();

  if (dates.length === 0) {
    historyContent.innerHTML = "<p>Δεν υπάρχουν καταχωρήσεις.</p>";
  } else {
    dates.forEach(date => {
      const row = document.createElement("div");
      row.className = "history-row";
      row.innerHTML = `
        <span>${date}</span>
        <span>${history[date].toFixed(2)} €</span>
      `;
      historyContent.appendChild(row);
    });
  }

  historyOverlay.style.display = "flex";
}

function closeHistoryModal() {
  historyOverlay.style.display = "none";
}
