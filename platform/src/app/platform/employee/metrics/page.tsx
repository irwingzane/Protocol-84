"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/lib/context/progress-context";
import { getMetricsFromProgress } from "@/lib/metrics";

export default function PerformanceMetricsPage() {
  const { progressPercent } = useProgress();
  const metrics = getMetricsFromProgress(progressPercent);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Metrics</h1>
        <p className="mt-1 text-gray-600">
          Projected scores based on your 12-week plan progress. Values increase as you complete weeks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Performance score" value={metrics.performanceScore} trend={metrics.trend} />
        <MetricCard title="Resilience score" value={metrics.resilienceScore} trend={metrics.trend} />
        <MetricCard title="Productivity index" value={metrics.productivityIndex} trend={metrics.trend} />
        <MetricCard title="Engagement level" value={metrics.engagementLevel} trend={metrics.trend} />
      </div>

      <Card>
        <CardTitle>Progress impact</CardTitle>
        <p className="mt-1 text-sm text-gray-500">Your current plan completion drives these metrics.</p>
        <div className="mt-4">
          <ProgressBar value={progressPercent} max={100} showLabel={true} />
        </div>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: number;
  trend: "up" | "down" | "stable";
}) {
  return (
    <Card>
      <CardTitle className="text-base">{title}</CardTitle>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">
        {trend === "up" ? "↑ Improving" : trend === "down" ? "↓ Early stage" : "→ Stable"}
      </p>
    </Card>
  );
}
