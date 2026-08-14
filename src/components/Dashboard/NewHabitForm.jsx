import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

// ADD: form now serves both "create" and "edit" — mode is derived from
// whether initialHabit was passed in, so callers don't need a separate flag.
//
// NOTE: this form no longer resyncs its fields via a useEffect when
// initialHabit changes. Instead, the parent must remount this component
// when switching to a different habit by passing a stable, habit-specific
// `key` prop, e.g.:
//
//   <NewHabitForm
//     key={initialHabit?.id ?? "new"}
//     initialHabit={initialHabit}
//     onSave={handleSave}
//     onClose={handleClose}
//     onSuccess={handleSuccess}
//   />
//
// This avoids the "Calling setState synchronously within an effect can
// trigger cascading renders" warning, since a key change causes React to
// unmount/remount with fresh state instead of patching state in place.
//
// FIX: removed the form's own "Dismiss" close button. Modal already renders
// a close (×) button plus Escape/backdrop-click handling, so this form no
// longer duplicates that control — onClose is still accepted as a prop in
// case the Cancel button needs it.
function NewHabitForm({ initialHabit, onSave, onClose, onSuccess }) {
  const isEditMode = Boolean(initialHabit);

  const [formData, setFormData] = useState({
    name: initialHabit?.name ?? "",
    unit: initialHabit?.unit ?? "",
    target: initialHabit?.target != null ? String(initialHabit.target) : "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) {
      return undefined;
    }
    const timer = setTimeout(() => {
      onSuccess?.();
    }, 1200);
    return () => clearTimeout(timer);
  }, [showSuccess, onSuccess]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedUnit = formData.unit.trim();
    const parsedTarget = Number(formData.target);

    const nextErrors = {};
    if (!trimmedName) nextErrors.name = "Habit name is required.";
    if (!trimmedUnit) nextErrors.unit = "Unit is required.";
    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      nextErrors.target = "Enter a target greater than 0.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // ADD: build a create payload or an edit payload (preserving id/logs)
    // depending on mode, and hand it to a single onSave callback — the
    // caller decides whether that means "append" or "replace by id".
    const habitData = isEditMode
      ? {
          ...initialHabit,
          name: trimmedName,
          unit: trimmedUnit,
          target: parsedTarget,
        }
      : {
          id: crypto.randomUUID(),
          name: trimmedName,
          unit: trimmedUnit,
          target: parsedTarget,
          logs: [],
        };

    onSave(habitData);

    if (!isEditMode) {
      setFormData({ name: "", unit: "", target: "" });
    }
    setErrors({});
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className={`${styles.successState} ${styles.successFadeIn}`}>
        <div className={styles.successIcon} aria-hidden="true">
          ✓
        </div>

        <h2>{isEditMode ? "Habit updated!" : "Habit added!"}</h2>
      </div>
    );
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <div>
          <p className={styles.eyebrow}>
            {isEditMode ? "Edit habit" : "New habit"}
          </p>
          <h2>{isEditMode ? "Update your ritual" : "Add a ritual"}</h2>
        </div>
      </div>

      <label className={styles.fieldGroup}>
        <span>Habit name</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Morning walk"
          onChange={handleChange}
          className={errors.name ? styles.fieldError : ""}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? <p className={styles.errorText}>{errors.name}</p> : null}
      </label>

      <div className={styles.fieldRow}>
        <label className={styles.fieldGroup}>
          <span>Unit</span>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            placeholder="minutes"
            onChange={handleChange}
            className={errors.unit ? styles.fieldError : ""}
            aria-invalid={Boolean(errors.unit)}
          />
          {errors.unit ? (
            <p className={styles.errorText}>{errors.unit}</p>
          ) : null}
        </label>

        <label className={styles.fieldGroup}>
          <span>Daily target</span>
          <input
            type="number"
            name="target"
            min="1"
            max="100000"
            step="1"
            value={formData.target}
            placeholder="30"
            onChange={handleChange}
            className={errors.target ? styles.fieldError : ""}
            aria-invalid={Boolean(errors.target)}
          />
          {errors.target ? (
            <p className={styles.errorText}>{errors.target}</p>
          ) : null}
        </label>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className={styles.primaryButton}>
          {isEditMode ? "Save changes" : "Save habit"}
        </button>
      </div>
    </form>
  );
}

export default NewHabitForm;
