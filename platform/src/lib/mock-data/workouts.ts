import type { Workout } from "@/types";

export const MOCK_WORKOUTS: Workout[] = [
  { id: "w1", title: "Boxing Conditioning Basics", duration: "25 min", difficulty: "Beginner", category: "boxing" },
  { id: "w2", title: "Advanced Boxing HIIT", duration: "35 min", difficulty: "Advanced", category: "boxing" },
  { id: "w3", title: "Boxing Footwork & Agility", duration: "20 min", difficulty: "Intermediate", category: "boxing" },
  { id: "w4", title: "Full Body Strength Circuit", duration: "40 min", difficulty: "Intermediate", category: "strength" },
  { id: "w5", title: "Upper Body Strength", duration: "30 min", difficulty: "Beginner", category: "strength" },
  { id: "w6", title: "Lower Body & Core", duration: "35 min", difficulty: "Intermediate", category: "strength" },
  { id: "w7", title: "Strength Foundations", duration: "28 min", difficulty: "Beginner", category: "strength" },
  { id: "w8", title: "Morning Mobility Flow", duration: "15 min", difficulty: "Beginner", category: "mobility" },
  { id: "w9", title: "Hip & Shoulder Mobility", duration: "20 min", difficulty: "Intermediate", category: "mobility" },
  { id: "w10", title: "Full Body Mobility", duration: "25 min", difficulty: "Advanced", category: "mobility" },
];

export const WORKOUT_CATEGORIES = [
  { key: "boxing", label: "Boxing conditioning" },
  { key: "strength", label: "Strength training" },
  { key: "mobility", label: "Mobility" },
] as const;
