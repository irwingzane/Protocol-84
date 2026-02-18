"use client";

import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/context/auth-context";
import { useProgress } from "@/lib/context/progress-context";
import { getMockActivity } from "@/lib/mock-data/activity";

export default function EmployeeDashboardPage() {
  const { employee } = useAuth();
  const { completedWeeks, progressPercent } = useProgress();
  const currentWeek = Math.min(completedWeeks + 1, 12);
  const activity = getMockActivity(completedWeeks);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{employee?.name ? ", " + employee.name : ""}
        </h1>
        <p className="mt-1 text-gray-600">Here is your overview and quick links.</p>
      </div>

      <Card>
        <CardTitle>Your 12-week plan progress</CardTitle>
        <p className="mt-1 text-sm text-gray-500">Current week: {currentWeek} of 12</p>
        <div className="mt-4">
          <ProgressBar value={completedWeeks} max={12} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/platform/employee/12-week-plan">View full plan</Button>
          <Button variant="secondary" href="/platform/employee/metrics">Performance metrics</Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardTitle>Quick links</CardTitle>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/platform/employee/workouts" className="text-primary-600 hover:underline">On demand workouts</Link></li>
            <li><Link href="/platform/employee/nutrition" className="text-primary-600 hover:underline">Nutrition plans</Link></li>
            <li><Link href="/platform/employee/mental-health" className="text-primary-600 hover:underline">Mental health zone</Link></li>
          </ul>
        </Card>
        <Card>
          <CardTitle>Recent activity</CardTitle>
          <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
            {activity.map((a) => (
              <li key={a.id}><span className="font-medium text-gray-800">{a.title}</span> · {a.date}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>Performance summary</CardTitle>
          <p className="mt-2 text-sm text-gray-600">Based on your progress ({progressPercent}% complete).</p>
          <Button variant="secondary" href="/platform/employee/metrics" className="mt-3">View metrics</Button>
        </Card>
      </div>
    </div>
  );
}
