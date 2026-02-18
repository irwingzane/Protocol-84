"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { MOCK_MENTAL_HEALTH, MENTAL_HEALTH_TYPES } from "@/lib/mock-data/mental-health";
import type { MentalHealthResource } from "@/types";

export default function MentalHealthPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = filter
    ? MOCK_MENTAL_HEALTH.filter((r) => r.type === filter)
    : MOCK_MENTAL_HEALTH;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Mental Health Zone</h1>
        <p className="mt-1 text-gray-600">
          Stress management, mindfulness, resilience, and habit tools. Take your time.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-smooth ${
            !filter ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {MENTAL_HEALTH_TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-smooth ${
              filter === t.key ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: MentalHealthResource }) {
  return (
    <Card className="border-blue-100 bg-white">
      <CardTitle>{resource.title}</CardTitle>
      {resource.duration && (
        <p className="mt-1 text-sm text-primary-600">{resource.duration}</p>
      )}
      <p className="mt-2 text-sm text-gray-600">{resource.description}</p>
    </Card>
  );
}
