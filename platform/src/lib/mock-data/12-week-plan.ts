import type { WeekPlan } from "@/types";

export const DEFAULT_WEEK_TITLES: Omit<WeekPlan, "completed" | "completedAt">[] = [
  { week: 1, title: "Foundation", description: "Baseline assessment, movement intro, sleep and habit foundations." },
  { week: 2, title: "Energy", description: "Building sustainable routines around your workday." },
  { week: 3, title: "Stress", description: "Tools to reset quickly between meetings and deadlines." },
  { week: 4, title: "Focus", description: "Structuring deep-work blocks and communication." },
  { week: 5, title: "Recovery", description: "Recovery protocols and active rest." },
  { week: 6, title: "Strength", description: "Progressive strength and conditioning focus." },
  { week: 7, title: "Resilience", description: "Mental resilience and setback management." },
  { week: 8, title: "Integration", description: "Bringing movement, nutrition, and habits together." },
  { week: 9, title: "Performance", description: "Peak performance and high-output days." },
  { week: 10, title: "Sustainability", description: "Long-term habit embedding." },
  { week: 11, title: "Review", description: "Progress review and adjustments." },
  { week: 12, title: "Graduation", description: "Programme completion and next steps." },
];

export function createInitialWeekPlans(completedWeeks: number = 0): WeekPlan[] {
  return DEFAULT_WEEK_TITLES.map((w, i) => ({
    ...w,
    completed: i < completedWeeks,
    completedAt: i < completedWeeks ? new Date().toISOString() : undefined,
  }));
}
