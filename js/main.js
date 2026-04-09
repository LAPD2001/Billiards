// αρχικές δηλώσεις
let tableCount = 0;

const dailyTotalEl = document.getElementById("dailyTotal");
const tablesContainer = document.getElementById("tables");
const addTableBtn = document.getElementById("addTableBtn");
const resetDayBtn = document.getElementById("resetDayBtn");

//for history modal
const dailyHistoryBtn = document.getElementById("dailyHistoryBtn");
const dailyHistoryOverlay = document.getElementById("dailyHistoryOverlay");
const dailyHistoryContent = document.getElementById("dailyHistoryContent");
const closeDailyHistory = document.getElementById("closeDailyHistory");

let currentBusinessDate = localStorage.getItem("businessDate") || getBusinessDate();

let dailyTotal = parseFloat(localStorage.getItem("dailyTotal")) || 0;

dailyTotalEl.textContent = dailyTotal.toFixed(2);

// events
addTableBtn.addEventListener("click", addTable);
resetDayBtn.addEventListener("click", resetDailyTotal);

// init
checkBusinessDayOnLoad();

const tables = loadBilliardTables();
tables.forEach((_, i) => createTableUI(i));