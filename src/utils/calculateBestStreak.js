function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateBestStreak(logs) {
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

  const dates = Array.from(totalsByDate.keys()).sort();
  if (dates.length === 0) {
    return 0;
  }

  let bestStreak = 0;
  let currentStreak = 0;
  let previousDate = null;

  for (const dateKey of dates) {
    const currentDate = new Date(`${dateKey}T00:00:00`);
    const amount = totalsByDate.get(dateKey) ?? 0;

    if (previousDate) {
      const diffInDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
      if (diffInDays > 1) {
        currentStreak = 0;
      }
    }

    if (amount > 0) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    previousDate = currentDate;
  }

  return bestStreak;
}

export default calculateBestStreak;
