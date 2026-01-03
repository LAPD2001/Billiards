let tableCount = 0;

const RESET_HOUR = 4; // 04:00 , για να κανιουμε reset το ημερήσιο σύνολο



let currentBusinessDate = localStorage.getItem("businessDate") || getBusinessDate();
let dailyTotal = parseFloat(localStorage.getItem("dailyTotal")) || 0;
dailyTotalEl.textContent = dailyTotal.toFixed(2);


const tablesContainer = document.getElementById("tables");
const addTableBtn = document.getElementById("addTableBtn");

const resetDayBtn = document.getElementById("resetDayBtn");
resetDayBtn.addEventListener("click", resetDailyTotal);

addTableBtn.addEventListener("click", addTable);

// ============================
// Δημιουργία μπιλιάρδου
// ============================
function addTable() {
  tableCount++;

  const table = document.createElement("div");
  table.className = "table";
  table.dataset.running = "false";
  table.dataset.startTime = "0";
  table.dataset.elapsed = "0";

  table.innerHTML = `
    <input class="table-name" value="Μπιλιάρδο #${tableCount}">
    <div>Χρόνος: <span class="time">00:00:00</span></div>
    <div>Χρέωση: <span class="cost">0.00</span> €</div>
    <div class="buttons">
      <button class="start">START</button>
      <button class="stop">STOP</button>
      <button class="reset">RESET</button>
    </div>
  `;


  table.querySelector(".start").addEventListener("click", () => startTimer(table));
  table.querySelector(".stop").addEventListener("click", () => stopTimer(table));
  table.querySelector(".reset").addEventListener("click", () => resetTable(table));

  tablesContainer.appendChild(table);
}

// ============================
// Timer functions
// ============================
function startTimer(table) {
  if (table.dataset.running === "true") return;

  table.dataset.running = "true";
  table.dataset.startTime = Date.now();

  table.timer = setInterval(() => updateTable(table), 1000);
}

function stopTimer(table) {
  if (table.dataset.running === "false") return;

  table.dataset.running = "false";
  clearInterval(table.timer);
}

function resetTable(table) {
  const cost = parseFloat(table.querySelector(".cost").textContent);

  if (cost > 0 && confirm(`Πληρώθηκαν ${cost.toFixed(2)} €;`)) {
    dailyTotal += cost;
    localStorage.setItem("dailyTotal", dailyTotal);
    dailyTotalEl.textContent = dailyTotal.toFixed(2);
  }

  clearInterval(table.timer);
  table.dataset.running = "false";
  table.dataset.elapsed = "0";
  table.querySelector(".time").textContent = "00:00:00";
  table.querySelector(".cost").textContent = "0.00";

  table.querySelector(".table-name").value = `Μπιλιάρδο #${[...tablesContainer.children].indexOf(table) + 1}`;
}

function updateTable(table) {
  const startTime = parseInt(table.dataset.startTime);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);

  table.dataset.elapsed = elapsed;
  table.querySelector(".time").textContent = formatTime(elapsed);
  updateCost(table, elapsed);
}

// ============================
// Υπολογισμοί
// ============================
function updateCost(table, seconds) {
  const pricePerHour = parseFloat(document.getElementById("pricePerHour").value) || 0;
  const minutes = seconds / 60;
  const cost = minutes * (pricePerHour / 60);

  table.querySelector(".cost").textContent = cost.toFixed(2);
}

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function resetDailyTotal() {
  if (!confirm("Θέλεις σίγουρα να μηδενίσεις το σύνολο της ημέρας;")) return;

  dailyTotal = 0;
  localStorage.setItem("dailyTotal", dailyTotal);
  dailyTotalEl.textContent = "0.00";
}


function getBusinessDate() {
  const now = new Date();
  if (now.getHours() < RESET_HOUR) {
    now.setDate(now.getDate() - 1);
  }
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}


setInterval(checkBusinessDayChange, 30000);
function checkBusinessDayChange() {
  const today = getBusinessDate();

  if (today !== currentBusinessDate) {
    saveDailyHistory(currentBusinessDate, dailyTotal);

    dailyTotal = 0;
    currentBusinessDate = today;

    localStorage.setItem("dailyTotal", 0);
    localStorage.setItem("businessDate", today);
    dailyTotalEl.textContent = "0.00";
  }
}

function saveDailyHistory(date, amount) {
  let history = JSON.parse(localStorage.getItem("dailyHistory")) || {};
  history[date] = amount;
  localStorage.setItem("dailyHistory", JSON.stringify(history));
}

console.log(JSON.parse(localStorage.getItem("dailyHistory")));




// ============================
// Αρχικό μπιλιάρδο
// ============================
addTable();
