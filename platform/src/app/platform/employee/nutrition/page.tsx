"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MOCK_NUTRITION_PLANS, NUTRITION_GOALS } from "@/lib/mock-data/nutrition";
import type { NutritionPlan } from "@/types";

export default function NutritionPage() {
  const [goal, setGoal] = useState<string | null>(null);
  const filtered = goal
    ? MOCK_NUTRITION_PLANS.filter((p) => p.goal === goal)
    : MOCK_NUTRITION_PLANS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nutrition Plans</h1>
        <p className="mt-1 text-gray-600">Structured plans by goal. View or download (placeholder).</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGoal(null)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            !goal ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {NUTRITION_GOALS.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setGoal(g.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              goal === g.key ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((plan) => (
          <NutritionCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function NutritionCard({ plan }: { plan: NutritionPlan }) {
  return (
    <Card>
      <CardTitle>{plan.title}</CardTitle>
      <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
      {plan.weeklyPlan && (
        <ul className="mt-3 list-inside list-disc text-sm text-gray-500">
          {plan.weeklyPlan.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex gap-2">
        <Button variant="primary">View plan</Button>
        <Button variant="secondary">Download (placeholder)</Button>
      </div>
    </Card>
  );
}
