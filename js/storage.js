function loadBilliardTables() {
  const data = localStorage.getItem("billiardTables");
  if (!data) {
    return [
      {
        name: "Μπιλιάρδο #1",
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

function saveDailyHistory(date, amount) {
  let history = JSON.parse(localStorage.getItem("dailyHistory")) || {};
  history[date] = amount;
  localStorage.setItem("dailyHistory", JSON.stringify(history));
}