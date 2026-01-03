//arxikes dhloseis
let tableCount = 0;

const dailyTotalEl = document.getElementById("dailyTotal");
const tablesContainer = document.getElementById("tables");
const addTableBtn = document.getElementById("addTableBtn");
const resetDayBtn = document.getElementById("resetDayBtn");
const RESET_HOUR = 4; // 04:00 , για να κανιουμε reset το ημερήσιο σύνολο

let currentBusinessDate = localStorage.getItem("businessDate") || getBusinessDate();
let dailyTotal = parseFloat(localStorage.getItem("dailyTotal")) || 0;
dailyTotalEl.textContent = dailyTotal.toFixed(2);


//arxikopoihsh selidas
const tables = loadBilliardTables();
tables.forEach((_, i) => createTableUI(i));

// const tablesContainer = document.getElementById("tables");
// const addTableBtn = document.getElementById("addTableBtn");

// const resetDayBtn = document.getElementById("resetDayBtn");
resetDayBtn.addEventListener("click", resetDailyTotal);

addTableBtn.addEventListener("click", addTable);

// ============================
// Δημιουργία μπιλιάρδου
// ============================
function addTable() {
  const tables = loadBilliardTables();

  const newTable = {
    name: `Μπιλιάρδο #${tables.length + 1}`,
    running: false,
    startTime: null,
    elapsedBefore: 0
  };

  tables.push(newTable);
  saveTables(tables);

  createTableUI(tables.length - 1);
}

function createTableUI(index) {
  const tables = loadBilliardTables();
  const t = tables[index];

  const table = document.createElement("div");
  table.className = "table";
  table.dataset.id = index;
  table.dataset.running = t.running ? "true" : "false";

  table.innerHTML = `
    <input class="table-name" value="#${t.name}">
    <div>Χρόνος: <span class="time">00:00:00</span></div>
    <div>Χρέωση: <span class="cost">0.00</span> €</div>
    <div class="buttons">
      <button class="start">START</button>
      <button class="stop">STOP</button>
      <button class="reset">RESET</button>
      <button class="removeTableBtn">Αφαίρεση τραπεζιού</button>
    </div>
  `;

  table.querySelector(".start").onclick = () => startTimer(table);
  table.querySelector(".stop").onclick = () => stopTimer(table);
  table.querySelector(".reset").onclick = () => resetTable(table);
  table.querySelector(".remove").onclick = () => removeTable(table);


  table.querySelector(".table-name").onchange = e => {
    t.name = e.target.value;
    saveTables(tables);
  };

  tablesContainer.appendChild(table);

  // if (t.running) {
  //   startTimer(table);
  // } else {
  //   updateTable(table);
  // }
  if (t.running) {
    table.timer = setInterval(() => {
    updateTable(table);
  }, 1000);
  updateTable(table);
} else {
  updateTable(table);
}
}


// ============================
// Timer functions
// ============================
function startTimer(table) {
  const id = table.dataset.id;
  const tables = loadBilliardTables();
  const t = tables[id];

  if (t.running) return; // idi trexei to timer

  t.running = true;
  t.startTime = Date.now();

  saveTables(tables);

  table.dataset.running = "true";

  table.timer = setInterval(() => {
    updateTable(table);
  }, 1000);
}


function stopTimer(table) {
  if (table.dataset.running !== "true") return;

  const id = table.dataset.id;
  const tables = loadBilliardTables();
  const t = tables[id];

  const now = Date.now();
  const elapsed = Math.floor((now - t.startTime) / 1000);

  // προσθέτουμε τον χρόνο που έτρεξε
  t.elapsedBefore += elapsed;

  // σταματάμε
  t.running = false;
  t.startTime = null;

  saveTables(tables);

  table.dataset.running = "false";
  clearInterval(table.timer);
  // ενημέρωση UI
  updateTable(table);
}


function loadBilliardTables() {
  const data = localStorage.getItem("billiardTables");
  if (!data) {
    return [
      {
        name: "Μπιλιάρδο 1",
        running: false,
        startTime: null,
        elapsedBefore: 0
      }
    ];
  }
  return JSON.parse(data);
}

function saveTables(tables) {
  localStorage.setItem("billiardTables", JSON.stringify(tables));
}


function resetTable(table) {
  const id = table.dataset.id;
  const tables = loadBilliardTables();
  const t = tables[id];

  // Υπολογισμός τελικού κόστους
  let seconds = t.elapsedBefore;
  if (t.running) {
    seconds += Math.floor((Date.now() - t.startTime) / 1000);
  }

  const cost = calculateCost(seconds);

  // Επιβεβαίωση πληρωμής
  if (cost > 0 && !confirm(`Πληρώθηκαν ${cost.toFixed(2)} €;`)) {
    return;
  }

  // Προσθήκη στο ημερήσιο σύνολο
  if (cost > 0) {
    dailyTotal += cost;
    localStorage.setItem("dailyTotal", dailyTotal);
    dailyTotalEl.textContent = dailyTotal.toFixed(2);
  }

  // ΣΤΑΜΑΤΑΜΕ TIMER
  clearInterval(table.timer);

  // RESET ΣΤΟ STORAGE
  t.running = false;
  t.startTime = null;
  t.elapsedBefore = 0;
  t.name = `Μπιλιάρδο #${Number(id) + 1}`;

  saveTables(tables);

  // RESET ΣΤΟ UI
  table.dataset.running = "false";
  table.querySelector(".time").textContent = "00:00:00";
  table.querySelector(".cost").textContent = "0.00 €";
  table.querySelector(".table-name").value = t.name;
}

function removeTable(table) {
  const id = Number(table.dataset.id);

  // ❌ ΠΟΤΕ το πρώτο τραπέζι
  if (id === 0) {
    alert("Το πρώτο μπιλιάρδο δεν μπορεί να αφαιρεθεί.");
    return;
  }

  const tables = loadBilliardTables();
  const t = tables[id];

  // Υπολογισμός χρόνου & κόστους
  let seconds = t.elapsedBefore;
  if (t.running) {
    seconds += Math.floor((Date.now() - t.startTime) / 1000);
  }

  const cost = calculateCost(seconds);

  // Αν είναι ανοιχτό ή έχει λεφτά → επιβεβαίωση
  if (t.running || cost > 0) {
    const ok = confirm(
      `Το μπιλιάρδο έχει ${
        t.running ? "ενεργό χρόνο" : ""
      }${t.running && cost > 0 ? " και " : ""}${
        cost > 0 ? cost.toFixed(2) + " €" : ""
      }.\nΘέλεις σίγουρα να το αφαιρέσεις;`
    );

    if (!ok) return;
  }

  // Σταμάτα timer αν τρέχει
  clearInterval(table.timer);

  // Αφαίρεση από storage
  tables.splice(id, 1);
  saveTables(tables);

  // Καθαρίζουμε UI
  tablesContainer.innerHTML = "";

  // Ξαναχτίζουμε όλα τα τραπέζια σωστά
  tables.forEach((_, i) => createTableUI(i));
}




function calculateCost(seconds) {
  const pricePerHour =
    parseFloat(document.getElementById("pricePerHour").value) || 0;

  return (seconds / 3600) * pricePerHour;
}


function updateTable(table) {
  const id = table.dataset.id;
  const tables = loadBilliardTables();
  const t = tables[id];

  let seconds = t.elapsedBefore;

  if (t.running) {
    seconds += Math.floor((Date.now() - t.startTime) / 1000);
  }

  table.querySelector(".time").textContent = formatTime(seconds);
  table.querySelector(".cost").textContent =
    calculateCost(seconds).toFixed(2) + " €";
}


// ============================
// Υπολογισμοί
// ============================
// function updateCost(table, seconds) {
//   const pricePerHour = parseFloat(document.getElementById("pricePerHour").value) || 0;
//   const minutes = seconds / 60;
//   const cost = minutes * (pricePerHour / 60);

//   table.querySelector(".cost").textContent = cost.toFixed(2);
// }

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
  if (now.getHours() < RESET_HOUR) {     ////// +4
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
//addTable();
