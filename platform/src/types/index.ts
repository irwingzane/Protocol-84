export type Role = "employee" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  completedWeeks: number;
  lastActivity: string;
  performanceScore: number;
  resilienceScore: number;
  engagementLevel: number;
}

export interface WeekPlan {
  week: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface Workout {
  id: string;
  title: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "boxing" | "strength" | "mobility";
  thumbnail?: string;
}

export interface NutritionPlan {
  id: string;
  title: string;
  goal: "weight_loss" | "performance" | "general_health";
  description: string;
  weeklyPlan?: string[];
}

export interface MentalHealthResource {
  id: string;
  title: string;
  type: "stress" | "mindfulness" | "resilience" | "habits";
  description: string;
  duration?: string;
}

export interface PerformanceMetrics {
  performanceScore: number;
  resilienceScore: number;
  productivityIndex: number;
  engagementLevel: number;
  trend: "up" | "down" | "stable";
}

export interface ActivityItem {
  id: string;
  title: string;
  type: string;
  date: string;
}
