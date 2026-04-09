// const dailyHistoryBtn = document.getElementById("dailyHistoryBtn");
// const dailyHistoryOverlay = document.getElementById("dailyHistoryOverlay");
// const dailyHistoryContent = document.getElementById("dailyHistoryContent");
// const closeDailyHistory = document.getElementById("closeDailyHistory");


const tabDaily = document.getElementById("tabDaily");
const tabMonthly = document.getElementById("tabMonthly");

tabDaily.onclick = () => setActiveTab("daily");
tabMonthly.onclick = () => setActiveTab("monthly");


//Gia ta tabs tou history modal
function setActiveTab(type) {
  tabDaily.classList.remove("active");
  tabMonthly.classList.remove("active");

  if (type === "daily") {
    tabDaily.classList.add("active");
    renderDaily();
  } else {
    tabMonthly.classList.add("active");
    renderMonthly();
  }
}

dailyHistoryBtn.onclick = openDailyHistory;
closeDailyHistory.onclick = closeDailyHistoryModal;


// click gia na kleisei to modal an paththei ektos tou content
dailyHistoryOverlay.onclick = e => {
  if (e.target === dailyHistoryOverlay) closeDailyHistoryModal();
};


function openDailyHistory() {
  dailyHistoryOverlay.style.display = "flex";
  setActiveTab("daily"); // default
}


function renderDaily() {
  dailyHistoryContent.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("dailyHistory")) || {};
  const dates = Object.keys(history).sort().reverse();

  if (dates.length === 0) {
    dailyHistoryContent.innerHTML = "<p>Δεν υπάρχουν καταχωρήσεις.</p>";
    return;
  }

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


function renderMonthly() {
  dailyHistoryContent.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("dailyHistory")) || {};
  const monthly = {};

  for (const date in history) {
    const month = date.slice(0, 7);

    if (!monthly[month]) {
      monthly[month] = 0;
    }

    monthly[month] += history[date];
  }

  const months = Object.keys(monthly).sort().reverse();

  if (months.length === 0) {
    dailyHistoryContent.innerHTML = "<p>Δεν υπάρχουν καταχωρήσεις.</p>";
    return;
  }

  months.forEach(month => {
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `
      <span>${month}</span>
      <span>${monthly[month].toFixed(2)} €</span>
    `;
    dailyHistoryContent.appendChild(row);
  });
}

// function openDailyHistory() {
//   dailyHistoryContent.innerHTML = "";

//   const history = JSON.parse(localStorage.getItem("dailyHistory")) || {};

//   const dates = Object.keys(history).sort().reverse();

//   if (dates.length === 0) {
//     dailyHistoryContent.innerHTML = "<p>Δεν υπάρχουν καταχωρήσεις.</p>";
//   } else {
//     dates.forEach(date => {
//       const row = document.createElement("div");
//       row.className = "history-row";
//       row.innerHTML = `
//         <span>${date}</span>
//         <span>${history[date].toFixed(2)} €</span>
//       `;
//       dailyHistoryContent.appendChild(row);
//     });
//   }

//   dailyHistoryOverlay.style.display = "flex";
// }

function closeDailyHistoryModal() {
  dailyHistoryOverlay.style.display = "none";
}
