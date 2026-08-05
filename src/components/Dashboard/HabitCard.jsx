import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ADD
import calculateStreak from "../../utils/calculateStreak.js";
import { getLocalDateKey } from "../../utils/dateKey.js";
import styles from "./Dashboard.module.css";

function HabitCard({ habit, onLogProgress, onSaveNote, onEdit, onDelete }) {
  const [amount, setAmount] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const navigate = useNavigate(); // ADD

  const todayKey = getLocalDateKey();

  const todayEntry = useMemo(
    () => habit.logs?.find((entry) => entry.date === todayKey),
    [habit.logs, todayKey],
  );

  const todayLog = todayEntry?.amount ?? 0;
  const todayNote = todayEntry?.note ?? "";

  const currentStreak = useMemo(
    () => calculateStreak(habit.logs ?? [], habit.target),
    [habit.logs, habit.target],
  );

  const progressRatio = Math.min((todayLog / habit.target) * 100, 100);
  const isComplete = todayLog >= habit.target;
  const overage = todayLog - habit.target;
  const handleCardClick = () => {
    navigate(`/habit/${habit.id}`); // adjust path to match your route config
  };
  const handleLog = () => {
    const parsedValue = Number(amount);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return;
    }

    onLogProgress(habit.id, parsedValue);
    setAmount("");
  };

  const handleStartNote = () => {
    setNoteDraft(todayNote);
    setIsEditingNote(true);
  };

  const handleCancelNote = () => {
    setIsEditingNote(false);
    setNoteDraft("");
  };

  const handleSaveNote = () => {
    onSaveNote(habit.id, noteDraft.trim());
    setIsEditingNote(false);
  };

  return (
    <article
      className={`${styles.habitCard} ${isComplete ? styles.habitCardComplete : ""}`}
      style={{
        "--progress-angle": `${(Math.min(progressRatio, 100) / 100) * 360}deg`,
      }}
      onClick={handleCardClick} // ADD
      role="link" // ADD: accessibility — announce as navigable
      tabIndex={0} // ADD: keyboard focusable
      onKeyDown={(event) => {
        // ADD: keyboard activation (Enter/Space)
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
    >
      {isComplete && (
        <div className={styles.goalMetRow}>
          <span className={styles.completeBadge} aria-label="Goal reached">
            ✓ Goal met
          </span>
        </div>
      )}
      <div className={styles.cardTopRow}>
        <span className={styles.streakBadge}>{currentStreak} day streak</span>
        <div className={styles.cardActionRow}>
          <button
            type="button"
            className={styles.actionButtonSecondary}
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(habit);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-pen-line-icon lucide-pen-line"
            >
              <path d="M13 21h8" />
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.actionButtonDanger}
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.(habit);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash2-icon lucide-trash-2"
            >
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.habitHeader}>
        <h2>{habit.name}</h2>
        <div className={styles.progressStack}>
          <div
            className={styles.progressRing}
            aria-label={`${todayLog} of ${habit.target} ${habit.unit}`}
          >
            <div className={styles.progressRingInner}>
              <span>{Math.round(progressRatio)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.progressMeta}>
        <span>
          {todayLog} of {habit.target} {habit.unit}
          {overage > 0 ? `, +${overage}` : ""}
        </span>
      </div>

      <div className={styles.progressBar}>
        <span style={{ width: `${progressRatio}%` }} />
      </div>

      <form
        className={styles.logRow}
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          handleLog();
        }}
      >
        <input
          type="number"
          min="0"
          step="1"
          value={amount}
          placeholder={`Add ${habit.unit}`}
          onChange={(event) => setAmount(event.target.value)}
        />
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleLog}
        >
          Log
        </button>
      </form>

      {todayLog > 0 ? (
        <div className={styles.notesSection}>
          {isEditingNote ? (
            <>
              <textarea
                className={styles.notesInput}
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                placeholder="Add details — a book title and your thoughts, the route and pace, whatever's worth remembering"
                rows={3}
              />
              <div className={styles.notesActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleCancelNote}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleSaveNote}
                >
                  Save
                </button>
              </div>
            </>
          ) : todayNote ? (
            <button
              type="button"
              className={styles.notesDisplay}
              onClick={handleStartNote}
            >
              <span>{todayNote}</span>
              <span className={styles.notesEditHint}>Edit</span>
            </button>
          ) : (
            <button
              type="button"
              className={styles.addDetailsLink}
              onClick={handleStartNote}
            >
              + Add details
            </button>
          )}
        </div>
      ) : null}
    </article>
  );
}

export default HabitCard;
