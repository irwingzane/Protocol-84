import type { NutritionPlan } from "@/types";

export const MOCK_NUTRITION_PLANS: NutritionPlan[] = [
  { id: "n1", title: "Calorie Deficit Weekly Plan", goal: "weight_loss", description: "Structured meal plans with moderate deficit for sustainable weight loss.", weeklyPlan: ["Day 1-2: High protein focus", "Day 3-4: Balanced macros", "Day 5-7: Recovery & flexibility"] },
  { id: "n2", title: "Performance Fuel Plan", goal: "performance", description: "Optimised for energy and recovery around training and work.", weeklyPlan: ["Pre-workout nutrition", "Post-workout recovery", "Daily hydration targets"] },
  { id: "n3", title: "General Health & Balance", goal: "general_health", description: "Flexible, balanced eating for long-term health and energy.", weeklyPlan: ["Weekly meal framework", "Portion guides", "Snack ideas"] },
  { id: "n4", title: "Rapid Reset (7 days)", goal: "weight_loss", description: "Short-term reset with clear guidelines.", weeklyPlan: ["Days 1-3: Reset phase", "Days 4-7: Steady state"] },
  { id: "n5", title: "Peak Performance", goal: "performance", description: "For high-output days and key sessions.", weeklyPlan: ["Training days", "Rest days", "Travel tips"] },
];

export const NUTRITION_GOALS = [
  { key: "weight_loss", label: "Weight loss" },
  { key: "performance", label: "Performance" },
  { key: "general_health", label: "General health" },
] as const;
