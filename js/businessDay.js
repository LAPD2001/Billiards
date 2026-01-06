const RESET_HOUR = 4; // 4 π.μ.

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

function checkBusinessDayOnLoad() {
  const today = getBusinessDate();

  if (today !== currentBusinessDate) {
    // σώζουμε το χθεσινό
    saveDailyHistory(currentBusinessDate, dailyTotal);

    // μηδενισμός
    dailyTotal = 0;
    currentBusinessDate = today;

    localStorage.setItem("dailyTotal", 0);
    localStorage.setItem("businessDate", today);
    dailyTotalEl.textContent = "0.00";
  }
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