import type { EmployeeProfile } from "@/types";

export const MOCK_EMPLOYEES: EmployeeProfile[] = [
  { id: "1", name: "Alex Morgan", email: "alex.morgan@company.com", department: "Engineering", completedWeeks: 8, lastActivity: "2024-02-15", performanceScore: 82, resilienceScore: 78, engagementLevel: 90 },
  { id: "2", name: "Jordan Lee", email: "jordan.lee@company.com", department: "Product", completedWeeks: 12, lastActivity: "2024-02-16", performanceScore: 94, resilienceScore: 88, engagementLevel: 95 },
  { id: "3", name: "Sam Taylor", email: "sam.taylor@company.com", department: "Sales", completedWeeks: 3, lastActivity: "2024-02-10", performanceScore: 58, resilienceScore: 52, engagementLevel: 65 },
  { id: "4", name: "Casey Davis", email: "casey.davis@company.com", department: "Marketing", completedWeeks: 6, lastActivity: "2024-02-14", performanceScore: 72, resilienceScore: 70, engagementLevel: 78 },
  { id: "5", name: "Riley Brown", email: "riley.brown@company.com", department: "Engineering", completedWeeks: 11, lastActivity: "2024-02-16", performanceScore: 88, resilienceScore: 85, engagementLevel: 92 },
  { id: "6", name: "Quinn Wilson", email: "quinn.wilson@company.com", department: "HR", completedWeeks: 2, lastActivity: "2024-02-08", performanceScore: 45, resilienceScore: 48, engagementLevel: 55 },
  { id: "7", name: "Morgan Clark", email: "morgan.clark@company.com", department: "Finance", completedWeeks: 9, lastActivity: "2024-02-15", performanceScore: 79, resilienceScore: 76, engagementLevel: 84 },
  { id: "8", name: "Avery White", email: "avery.white@company.com", department: "Product", completedWeeks: 5, lastActivity: "2024-02-12", performanceScore: 68, resilienceScore: 65, engagementLevel: 72 },
  { id: "9", name: "Blake Martinez", email: "blake.martinez@company.com", department: "Engineering", completedWeeks: 12, lastActivity: "2024-02-16", performanceScore: 96, resilienceScore: 92, engagementLevel: 98 },
  { id: "10", name: "Skyler Johnson", email: "skyler.johnson@company.com", department: "Sales", completedWeeks: 4, lastActivity: "2024-02-11", performanceScore: 62, resilienceScore: 58, engagementLevel: 68 },
  { id: "11", name: "Cameron Garcia", email: "cameron.garcia@company.com", department: "Marketing", completedWeeks: 7, lastActivity: "2024-02-13", performanceScore: 75, resilienceScore: 74, engagementLevel: 80 },
  { id: "12", name: "Drew Anderson", email: "drew.anderson@company.com", department: "HR", completedWeeks: 1, lastActivity: "2024-02-05", performanceScore: 38, resilienceScore: 42, engagementLevel: 50 },
  { id: "13", name: "Emery Thomas", email: "emery.thomas@company.com", department: "Finance", completedWeeks: 10, lastActivity: "2024-02-14", performanceScore: 85, resilienceScore: 82, engagementLevel: 88 },
  { id: "14", name: "Finley Jackson", email: "finley.jackson@company.com", department: "Product", completedWeeks: 0, lastActivity: "2024-02-01", performanceScore: 30, resilienceScore: 35, engagementLevel: 40 },
  { id: "15", name: "Reese Harris", email: "reese.harris@company.com", department: "Engineering", completedWeeks: 6, lastActivity: "2024-02-12", performanceScore: 71, resilienceScore: 69, engagementLevel: 76 },
];

export function getEmployeeById(id: string): EmployeeProfile | undefined {
  return MOCK_EMPLOYEES.find((e) => e.id === id);
}

export function getDefaultEmployee(): EmployeeProfile {
  return MOCK_EMPLOYEES[0];
}
