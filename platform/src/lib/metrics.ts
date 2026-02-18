import type { PerformanceMetrics } from "@/types";

export function getMetricsFromProgress(progressPercent: number): PerformanceMetrics {
  const base = 30 + (progressPercent * 0.6);
  const variance = Math.sin(progressPercent / 20) * 5;
  return {
    performanceScore: Math.round(Math.min(100, base + variance)),
    resilienceScore: Math.round(Math.min(100, base + 2 + variance)),
    productivityIndex: Math.round(Math.min(100, base - 2 + variance)),
    engagementLevel: Math.round(Math.min(100, base + 4 + variance)),
    trend: progressPercent > 50 ? "up" : progressPercent > 20 ? "stable" : "down",
  };
}
