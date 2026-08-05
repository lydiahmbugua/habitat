// No issues found — unchanged from the original.
import styles from "./HabitDetail.module.css";

const RANGE_OPTIONS = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "half-year", label: "Half Year" },
  { value: "year", label: "Year" },
];

function TimeRangeSelector({ selectedRange, onRangeChange }) {
  return (
    <div className={styles.rangeSelector}>
      {RANGE_OPTIONS.map((option) => {
        const isSelected = option.value === selectedRange;

        return (
          <button
            key={option.value}
            type="button"
            className={`${styles.rangeButton} ${isSelected ? styles.rangeButtonActive : styles.rangeButtonInactive}`}
            onClick={() => onRangeChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default TimeRangeSelector;
