import { useEffect, useState } from "react";

const STORAGE_KEY = "habitat-habits";

function useHabitStorage() {
  const [habits, setHabits] = useState(() => {
    try {
      const savedHabits = localStorage.getItem(STORAGE_KEY);
      return savedHabits ? JSON.parse(savedHabits) : [];
    } catch (error) {
      console.error("Unable to load saved habits", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  return { habits, setHabits };
}

export default useHabitStorage;
