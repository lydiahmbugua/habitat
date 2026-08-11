import { useState } from "react";
import AppNav from "../Navigation/AppNav.jsx";
import Modal from "../Modal/Modal.jsx";
import HabitCard from "./HabitCard.jsx";
import NewHabitForm from "./NewHabitForm.jsx";
import useHabitStorage from "../../hooks/useHabitStorage.js";
import styles from "./Dashboard.module.css";
import ConfirmDeleteModal from "../ConfirmDelete/ConfirmDelete.jsx";

function Dashboard() {
  const { habits, setHabits } = useHabitStorage();
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const handleLogProgress = (habitId, amount) => {
    const today = new Date().toISOString().slice(0, 10);

    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const existingEntry = (habit.logs ?? []).find(
          (entry) => entry.date === today,
        );
        const nextLogs = (habit.logs ?? []).filter(
          (entry) => entry.date !== today,
        );
        const nextAmount = (existingEntry?.amount ?? 0) + Number(amount);

        return {
          ...habit,
          logs: [
            ...nextLogs,
            {
              date: today,
              amount: nextAmount,
              note: existingEntry?.note ?? "",
            },
          ],
        };
      }),
    );
  };

  const handleSaveNote = (habitId, note) => {
    const today = new Date().toISOString().slice(0, 10);

    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const hasTodayEntry = (habit.logs ?? []).some(
          (entry) => entry.date === today,
        );

        if (!hasTodayEntry) {
          return habit;
        }

        return {
          ...habit,
          logs: habit.logs.map((entry) =>
            entry.date === today ? { ...entry, note } : entry,
          ),
        };
      }),
    );
  };

  const handleSaveHabit = (habitData) => {
    setHabits((currentHabits) => {
      if (currentHabits.some((habit) => habit.id === habitData.id)) {
        return currentHabits.map((habit) =>
          habit.id === habitData.id ? habitData : habit,
        );
      }

      return [...currentHabits, habitData];
    });
  };
  const deleteHabit = (habitId) => {
    setHabits((currentHabits) =>
      currentHabits.filter((habit) => habit.id !== habitId),
    );
  };
  const closeModal = () => {
    setIsAddHabitModalOpen(false);
    setEditingHabit(null);
  };

  return (
    <>
      <AppNav />

      <main className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Your habits</p>
            <h1>Habit Dashboard</h1>
          </div>

          {habits.length > 0 && (
            <button
              type="button"
              className={styles.addHabitButton}
              onClick={() => setIsAddHabitModalOpen(true)}
              aria-label="Add habit"
              title="Add habit"
            >
              +
            </button>
          )}
        </header>

        <Modal
          isOpen={isAddHabitModalOpen || Boolean(editingHabit)}
          onClose={closeModal}
        >
          {editingHabit ? (
            <NewHabitForm
              key={editingHabit.id}
              initialHabit={editingHabit}
              onSave={handleSaveHabit}
              onClose={closeModal}
              onSuccess={closeModal}
            />
          ) : (
            <NewHabitForm
              key="new"
              onSave={handleSaveHabit}
              onClose={closeModal}
              onSuccess={closeModal}
            />
          )}
        </Modal>

        {habits.length === 0 ? (
          <section className={styles.emptyState}>
            <h2>Start your calm streak.</h2>
            <p>
              You have not added any habits yet. Add your first one to begin
              building gentle momentum.
            </p>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setIsAddHabitModalOpen(true)}
            >
              Add your first habit
            </button>
          </section>
        ) : (
          <section className={styles.cardGrid}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onLogProgress={handleLogProgress}
                onSaveNote={handleSaveNote}
                onEdit={(selectedHabit) => setEditingHabit(selectedHabit)}
                onDelete={(habit) => setHabitToDelete(habit)}
              />
            ))}
          </section>
        )}
      </main>
      <ConfirmDeleteModal
        isOpen={!!habitToDelete}
        habitName={habitToDelete?.name}
        onCancel={() => setHabitToDelete(null)}
        onConfirm={() => {
          deleteHabit(habitToDelete.id);
          setHabitToDelete(null);
        }}
      />
    </>
  );
}

export default Dashboard;
