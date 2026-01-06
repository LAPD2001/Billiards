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
  //t.name = `Μπιλιάρδο #${Number(id) + 1}`;    ///////to kano gia na min allazei to onoma meta to reset

  saveTables(tables);

  // RESET ΣΤΟ UI
  table.dataset.running = "false";
  table.querySelector(".time").textContent = "00:00:00";
  table.querySelector(".cost").textContent = "0.00 €";
  table.querySelector(".table-name").value = t.name;
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

function calculateCost(seconds) {
  const pricePerHour =
    parseFloat(document.getElementById("pricePerHour").value) || 0;

  return (seconds / 3600) * pricePerHour;
}

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}