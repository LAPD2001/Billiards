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
    <input class="table-name" value="${t.name}">
    <div>Χρόνος: <span class="time">00:00:00</span></div>
    <div>Χρέωση: <span class="cost">0.00</span></div>
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
  table.querySelector(".removeTableBtn").onclick = () => removeTable(table);


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