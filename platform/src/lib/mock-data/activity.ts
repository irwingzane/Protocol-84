import type { ActivityItem } from "@/types";

export function getMockActivity(completedWeeks: number): ActivityItem[] {
  const items: ActivityItem[] = [];
  if (completedWeeks >= 1) items.push({ id: "a1", title: "Week 1 completed", type: "Plan", date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10) });
  if (completedWeeks >= 2) items.push({ id: "a2", title: "Week 2 completed", type: "Plan", date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().slice(0, 10) });
  items.push({ id: "a3", title: "Viewed Strength training", type: "Workout", date: new Date().toISOString().slice(0, 10) });
  items.push({ id: "a4", title: "Checked Performance metrics", type: "Metrics", date: new Date().toISOString().slice(0, 10) });
  return items.slice(0, 5);
}
