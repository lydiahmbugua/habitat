import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppNav from "../Navigation/AppNav.jsx";
import useHabitStorage from "../../hooks/useHabitStorage.js";
import calculateBestStreak from "../../utils/calculateBestStreak.js";
import calculateStreak from "../../utils/calculateStreak.js";
import HabitProgressChart from "./HabitProgressChart.jsx";
import TimeRangeSelector from "./TimeRangeSelector.jsx";
import styles from "./HabitDetail.module.css";

function HabitDetail() {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const { habits } = useHabitStorage();
  const [selectedRange, setSelectedRange] = useState("week");

  const habit = useMemo(
    () => habits.find((item) => item.id === habitId),
    [habitId, habits],
  );

  useEffect(() => {
    if (!habit) {
      navigate("/dashboard");
    }
  }, [habit, navigate]);

  if (!habit) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rangeDays = {
    week: 7,
    month: 30,
    quarter: 90,
    "half-year": 180,
    year: 365,
  };

  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - (rangeDays[selectedRange] ?? 7));

  const logsInRange = (habit.logs ?? []).filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate && entryDate <= today;
  });

  const totalAmountLogged = logsInRange.reduce(
    (sum, entry) => sum + Number(entry.amount ?? 0),
    0,
  );

  const notesInRange = logsInRange
    .filter((entry) => entry.note && entry.note.trim().length > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <AppNav onAddHabit={() => navigate("/dashboard")} />

      <main className={styles.page}>
        <section className={styles.detailCard}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Habit detail</p>
              <h1>{habit.name}</h1>
            </div>
          </header>

          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span>Current streak</span>
              <strong>
                {calculateStreak(habit.logs ?? [], habit.target)} days
              </strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Best streak</span>
              <strong>
                {calculateBestStreak(habit.logs ?? [], habit.target)} days
              </strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Total logged</span>
              <strong>
                {totalAmountLogged} {habit.unit}
              </strong>
            </div>
          </div>

          <TimeRangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />

          <HabitProgressChart
            logs={habit.logs ?? []}
            target={habit.target}
            range={selectedRange}
          />

          {notesInRange.length > 0 ? (
            <div className={styles.notesList}>
              <h2>Notes</h2>
              {notesInRange.map((entry) => (
                <div key={entry.date} className={styles.noteEntry}>
                  <span className={styles.noteDate}>
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <p>{entry.note}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}

export default HabitDetail;
