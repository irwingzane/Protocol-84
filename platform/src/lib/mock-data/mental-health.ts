import type { MentalHealthResource } from "@/types";

export const MOCK_MENTAL_HEALTH: MentalHealthResource[] = [
  { id: "m1", title: "5-Minute Stress Reset", type: "stress", description: "Quick breathing and grounding exercise for between meetings.", duration: "5 min" },
  { id: "m2", title: "Pre-Presentation Calm", type: "stress", description: "Reduce anxiety before high-stakes moments.", duration: "10 min" },
  { id: "m3", title: "Daily Mindfulness", type: "mindfulness", description: "Guided mindfulness for focus and clarity.", duration: "12 min" },
  { id: "m4", title: "Evening Wind-Down", type: "mindfulness", description: "Transition from work to rest.", duration: "15 min" },
  { id: "m5", title: "Resilience Building Blocks", type: "resilience", description: "Core practices for mental resilience." },
  { id: "m6", title: "Setback Recovery", type: "resilience", description: "Reframe and bounce back from setbacks." },
  { id: "m7", title: "Habit Stacking", type: "habits", description: "Attach new habits to existing routines." },
  { id: "m8", title: "Accountability System", type: "habits", description: "Track and reinforce positive habits." },
];

export const MENTAL_HEALTH_TYPES = [
  { key: "stress", label: "Stress management" },
  { key: "mindfulness", label: "Mindfulness" },
  { key: "resilience", label: "Mental resilience" },
  { key: "habits", label: "Habit system" },
] as const;
