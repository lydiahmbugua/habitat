function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateStreak(logs) {
  if (!Array.isArray(logs) || logs.length === 0) {
    return 0;
  }

  // target is accepted for call-site compatibility but no longer gates the
  // streak — any day with logged progress counts, whether or not the goal
  // was reached.

  const totalsByDate = new Map();

  for (const entry of logs) {
    if (!entry || !entry.date) {
      continue;
    }

    const date = new Date(entry.date);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const key = formatDateKey(date);
    const amount = Number(entry.amount);

    if (!Number.isFinite(amount)) {
      continue;
    }

    const previousAmount = totalsByDate.get(key) ?? 0;
    totalsByDate.set(key, Math.max(previousAmount, amount));
  }

  const getAmountForDate = (date) => totalsByDate.get(formatDateKey(date)) ?? 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayComplete = getAmountForDate(today) > 0;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayComplete = getAmountForDate(yesterday) > 0;

  if (!todayComplete && !yesterdayComplete) {
    return 0;
  }

  let streak = 1;
  let cursor = todayComplete ? new Date(today) : new Date(yesterday);

  // If today is complete, it starts the streak. If today has no log yet, we still
  // allow the streak to continue as long as yesterday was completed; that prevents a
  // false break on a brand-new day before the user logs anything.

  while (true) {
    const previousDay = new Date(cursor);
    previousDay.setDate(previousDay.getDate() - 1);

    if (getAmountForDate(previousDay) > 0) {
      streak += 1;
      cursor = previousDay;
      continue;
    }

    // A day with no logged progress ends the current streak; we stop counting
    // at the first gap because the consecutive run is no longer valid.
    return streak;
  }
}

export default calculateStreak;
