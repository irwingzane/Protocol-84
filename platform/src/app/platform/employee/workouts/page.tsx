"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { MOCK_WORKOUTS, WORKOUT_CATEGORIES } from "@/lib/mock-data/workouts";
import type { Workout } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  boxing: "Boxing conditioning",
  strength: "Strength training",
  mobility: "Mobility",
};

export default function WorkoutsPage() {
  const [category, setCategory] = useState<string | null>(null);
  const filtered = category
    ? MOCK_WORKOUTS.filter((w) => w.category === category)
    : MOCK_WORKOUTS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">On Demand Workouts</h1>
        <p className="mt-1 text-gray-600">Filter by category and choose a session.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            !category ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {WORKOUT_CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              category === c.key ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w) => (
          <WorkoutCard key={w.id} workout={w} />
        ))}
      </div>
    </div>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video flex items-center justify-center bg-gray-200 text-sm text-gray-400">
        Placeholder video
      </div>
      <div className="p-4">
        <CardTitle>{workout.title}</CardTitle>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
          <span>{workout.duration}</span>
          <span>{workout.difficulty}</span>
          <span>{CATEGORY_LABELS[workout.category] || workout.category}</span>
        </div>
      </div>
    </Card>
  );
}
