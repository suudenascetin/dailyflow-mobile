import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Habit = {
  id: number;
  title: string;
  current: number;
  target: number;
  unit: string;
  category: string;
  color: string;
  icon: string;
};

export type HistoryEntry = {
  date: string;
  totalHabits: number;
  completedHabits: number;
  averageProgress: number;
  totalActions: number;
};

type HabitContextType = {
  habits: Habit[];
  streak: number;
  history: HistoryEntry[];
  isDarkMode: boolean;
  addHabit: (
    title: string,
    target: number,
    unit: string,
    category: string
  ) => void;
  increaseHabit: (id: number) => void;
  resetHabit: (id: number) => void;
  deleteHabit: (id: number) => void;
  resetAllHabits: () => void;
  updateHabit: (
    id: number,
    title: string,
    target: number,
    unit: string
  ) => void;
  toggleDarkMode: () => void;
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = "DAILYFLOW_HABITS";
const STREAK_STORAGE_KEY = "DAILYFLOW_STREAK";
const LAST_COMPLETION_DATE_KEY = "DAILYFLOW_LAST_COMPLETION_DATE";
const HISTORY_STORAGE_KEY = "DAILYFLOW_HISTORY";
const LAST_OPEN_DATE_KEY = "DAILYFLOW_LAST_OPEN_DATE";
const DARK_MODE_KEY = "DAILYFLOW_DARK_MODE";

const defaultHabits: Habit[] = [
  {
    id: 1,
    title: "Drink Water",
    current: 5,
    target: 8,
    unit: "glasses",
    category: "Health",
    color: "#4FC3F7",
    icon: "💧",
  },
  {
    id: 2,
    title: "Read Book",
    current: 20,
    target: 30,
    unit: "min",
    category: "Study",
    color: "#FFB74D",
    icon: "📚",
  },
  {
    id: 3,
    title: "Coding Practice",
    current: 1,
    target: 2,
    unit: "hours",
    category: "Work",
    color: "#9575CD",
    icon: "💻",
  },
];

const categoryOptions = [
  { name: "Health", color: "#4FC3F7", icon: "💧" },
  { name: "Study", color: "#FFB74D", icon: "📚" },
  { name: "Work", color: "#9575CD", icon: "💻" },
  { name: "Sport", color: "#81C784", icon: "🏃" },
  { name: "Mind", color: "#F06292", icon: "🧘" },
  { name: "Personal", color: "#5B4DFF", icon: "⭐" },
];

const getDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const getTodayKey = () => {
  return getDateKey(new Date());
};

const getYesterdayKey = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateKey(yesterday);
};

const calculateHistoryEntry = (
  date: string,
  habits: Habit[]
): HistoryEntry => {
  const totalHabits = habits.length;

  const completedHabits = habits.filter(
    (habit) => habit.current >= habit.target
  ).length;

  const totalActions = habits.reduce((sum, habit) => {
    return sum + habit.current;
  }, 0);

  const averageProgress =
    totalHabits === 0
      ? 0
      : Math.round(
          habits.reduce((sum, habit) => {
            const percent = Math.min((habit.current / habit.target) * 100, 100);
            return sum + percent;
          }, 0) / totalHabits
        );

  return {
    date,
    totalHabits,
    completedHabits,
    averageProgress,
    totalActions,
  };
};

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastCompletionDate, setLastCompletionDate] = useState<string | null>(
    null
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [habits, streak, history, lastCompletionDate, isDarkMode, isLoaded]);

  const loadData = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      const storedStreak = await AsyncStorage.getItem(STREAK_STORAGE_KEY);
      const storedLastDate = await AsyncStorage.getItem(
        LAST_COMPLETION_DATE_KEY
      );
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      const storedLastOpenDate = await AsyncStorage.getItem(LAST_OPEN_DATE_KEY);
      const storedDarkMode = await AsyncStorage.getItem(DARK_MODE_KEY);

      const today = getTodayKey();

      let loadedHabits: Habit[] = defaultHabits;
      let loadedHistory: HistoryEntry[] = storedHistory
        ? JSON.parse(storedHistory)
        : [];

      if (storedHabits) {
        const parsedHabits = JSON.parse(storedHabits);

        loadedHabits = parsedHabits.map((habit: Habit) => ({
          ...habit,
          category: habit.category || "Personal",
          color: habit.color || "#5B4DFF",
          icon: habit.icon || "⭐",
        }));
      }

      if (storedLastOpenDate && storedLastOpenDate !== today) {
        const yesterdaySummary = calculateHistoryEntry(
          storedLastOpenDate,
          loadedHabits
        );

        const alreadyExists = loadedHistory.some(
          (item) => item.date === storedLastOpenDate
        );

        if (!alreadyExists) {
          loadedHistory = [yesterdaySummary, ...loadedHistory].slice(0, 30);
        }

        loadedHabits = loadedHabits.map((habit) => ({
          ...habit,
          current: 0,
        }));
      }

      setHabits(loadedHabits);
      setHistory(loadedHistory);
      setStreak(storedStreak ? Number(storedStreak) : 0);
      setLastCompletionDate(storedLastDate);
      setIsDarkMode(storedDarkMode === "true");

      await AsyncStorage.setItem(LAST_OPEN_DATE_KEY, today);
    } catch (error) {
      console.log("Data could not be loaded:", error);
      setHabits(defaultHabits);
      setHistory([]);
      setStreak(0);
      setLastCompletionDate(null);
      setIsDarkMode(false);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      await AsyncStorage.setItem(STREAK_STORAGE_KEY, String(streak));
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      await AsyncStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
      await AsyncStorage.setItem(LAST_OPEN_DATE_KEY, getTodayKey());

      if (lastCompletionDate) {
        await AsyncStorage.setItem(LAST_COMPLETION_DATE_KEY, lastCompletionDate);
      } else {
        await AsyncStorage.removeItem(LAST_COMPLETION_DATE_KEY);
      }
    } catch (error) {
      console.log("Data could not be saved:", error);
    }
  };

  const updateStreakIfNeeded = () => {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();

    if (lastCompletionDate === today) {
      return;
    }

    if (lastCompletionDate === yesterday) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(1);
    }

    setLastCompletionDate(today);
  };

  const addHabit = (
    title: string,
    target: number,
    unit: string,
    category: string
  ) => {
    const selectedCategory =
      categoryOptions.find((item) => item.name === category) ||
      categoryOptions[5];

    const newHabit: Habit = {
      id: Date.now(),
      title,
      current: 0,
      target,
      unit,
      category: selectedCategory.name,
      color: selectedCategory.color,
      icon: selectedCategory.icon,
    };

    setHabits([newHabit, ...habits]);
  };

  const increaseHabit = (id: number) => {
    let shouldUpdateStreak = false;

    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const previousCurrent = habit.current;
        const newCurrent = Math.min(habit.current + 1, habit.target);

        if (previousCurrent < habit.target && newCurrent >= habit.target) {
          shouldUpdateStreak = true;
        }

        return {
          ...habit,
          current: newCurrent,
        };
      }

      return habit;
    });

    setHabits(updatedHabits);

    if (shouldUpdateStreak) {
      updateStreakIfNeeded();
    }
  };

  const resetHabit = (id: number) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        return {
          ...habit,
          current: 0,
        };
      }

      return habit;
    });

    setHabits(updatedHabits);
  };

  const deleteHabit = (id: number) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(updatedHabits);
  };

  const resetAllHabits = () => {
    setHabits(defaultHabits);
    setStreak(0);
    setHistory([]);
    setLastCompletionDate(null);
  };

  const updateHabit = (
    id: number,
    title: string,
    target: number,
    unit: string
  ) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        return {
          ...habit,
          title,
          target,
          unit,
          current: Math.min(habit.current, target),
        };
      }

      return habit;
    });

    setHabits(updatedHabits);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        streak,
        history,
        isDarkMode,
        addHabit,
        increaseHabit,
        resetHabit,
        deleteHabit,
        resetAllHabits,
        updateHabit,
        toggleDarkMode,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabits must be used inside HabitProvider");
  }

  return context;
}