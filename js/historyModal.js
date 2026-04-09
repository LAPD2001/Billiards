// const dailyHistoryBtn = document.getElementById("dailyHistoryBtn");
// const dailyHistoryOverlay = document.getElementById("dailyHistoryOverlay");
// const dailyHistoryContent = document.getElementById("dailyHistoryContent");
// const closeDailyHistory = document.getElementById("closeDailyHistory");

dailyHistoryBtn.onclick = openDailyHistory;
closeDailyHistory.onclick = closeDailyHistoryModal;

// click gia na kleisei to modal an paththei ektos tou content
dailyHistoryOverlay.onclick = e => {
  if (e.target === dailyHistoryOverlay) closeDailyHistoryModal();
};

function openDailyHistory() {
  dailyHistoryContent.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("dailyHistory")) || {};

  const dates = Object.keys(history).sort().reverse();

  if (dates.length === 0) {
    dailyHistoryContent.innerHTML = "<p>Δεν υπάρχουν καταχωρήσεις.</p>";
  } else {
    dates.forEach(date => {
      const row = document.createElement("div");
      row.className = "history-row";
      row.innerHTML = `
        <span>${date}</span>
        <span>${history[date].toFixed(2)} €</span>
      `;
      dailyHistoryContent.appendChild(row);
    });
  }

  dailyHistoryOverlay.style.display = "flex";
}

function closeDailyHistoryModal() {
  dailyHistoryOverlay.style.display = "none";
}
