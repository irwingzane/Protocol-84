"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { useProgress } from "@/lib/context/progress-context";

export default function TwelveWeekPlanPage() {
  const { completedWeeks, weekPlans, progressPercent, markWeekComplete } = useProgress();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">12 Week Performance Plan</h1>
        <p className="mt-1 text-gray-600">
          Complete each week to unlock the next. Progress is saved locally.
        </p>
      </div>

      <Card>
        <CardTitle>Overall progress</CardTitle>
        <div className="mt-4">
          <ProgressBar value={completedWeeks} max={12} />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {completedWeeks} completed · {12 - completedWeeks} remaining · {progressPercent}%
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weekPlans.map((week) => (
          <Card key={week.week} className={week.completed ? "border-primary-200 bg-primary-50/30" : ""}>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Week {week.week}: {week.title}</CardTitle>
                <p className="mt-1 text-sm text-gray-600">{week.description}</p>
              </div>
              {week.completed ? (
                <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                  Done
                </span>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => markWeekComplete(week.week)}
                >
                  Mark complete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
