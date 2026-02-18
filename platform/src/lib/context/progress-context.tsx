"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { WeekPlan } from "@/types";
import { createInitialWeekPlans } from "@/lib/mock-data/12-week-plan";
import { useAuth } from "./auth-context";

const STORAGE_KEY = "protocol84_progress";
const TOTAL_WEEKS = 12;

type ProgressState = {
  completedWeeks: number;
  weekPlans: WeekPlan[];
};

type ProgressContextValue = ProgressState & {
  markWeekComplete: (weekNumber: number) => void;
  progressPercent: number;
  setWeekPlans: (plans: WeekPlan[]) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadStoredProgress(employeeId: string | null): ProgressState | null {
  if (!employeeId) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, { completedWeeks: number; weekPlans: WeekPlan[] }>;
    const data = all[employeeId];
    if (!data || !Array.isArray(data.weekPlans)) return null;
    return { completedWeeks: data.completedWeeks, weekPlans: data.weekPlans };
  } catch {
    return null;
  }
}

function saveProgress(employeeId: string, state: ProgressState) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[employeeId] = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { employee } = useAuth();
  const [state, setState] = useState<ProgressState>(() => {
    if (!employee) return { completedWeeks: 0, weekPlans: createInitialWeekPlans(0) };
    const stored = loadStoredProgress(employee.id);
    if (stored) return stored;
    return {
      completedWeeks: employee.completedWeeks ?? 0,
      weekPlans: createInitialWeekPlans(employee.completedWeeks ?? 0),
    };
  });

  useEffect(() => {
    if (!employee) {
      setState({ completedWeeks: 0, weekPlans: createInitialWeekPlans(0) });
      return;
    }
    const stored = loadStoredProgress(employee.id);
    if (stored) setState(stored);
    else setState({ completedWeeks: employee.completedWeeks ?? 0, weekPlans: createInitialWeekPlans(employee.completedWeeks ?? 0) });
  }, [employee?.id]);

  const markWeekComplete = useCallback(
    (weekNumber: number) => {
      if (!employee) return;
      setState((prev) => {
        const alreadyCompleted = prev.weekPlans.find((w) => w.week === weekNumber)?.completed;
        if (alreadyCompleted) return prev;
        const newPlans = prev.weekPlans.map((w) =>
          w.week === weekNumber ? { ...w, completed: true, completedAt: new Date().toISOString() } : w
        );
        const completedWeeks = newPlans.filter((w) => w.completed).length;
        const next = { completedWeeks, weekPlans: newPlans };
        saveProgress(employee.id, next);
        return next;
      });
    },
    [employee]
  );

  const setWeekPlans = useCallback(
    (weekPlans: WeekPlan[]) => {
      if (!employee) return;
      const completedWeeks = weekPlans.filter((w) => w.completed).length;
      const next = { completedWeeks, weekPlans };
      setState(next);
      saveProgress(employee.id, next);
    },
    [employee]
  );

  const progressPercent = Math.round((state.completedWeeks / TOTAL_WEEKS) * 100);

  const value: ProgressContextValue = {
    ...state,
    markWeekComplete,
    progressPercent,
    setWeekPlans,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
