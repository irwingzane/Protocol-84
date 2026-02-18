"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { MOCK_EMPLOYEES } from "@/lib/mock-data/employees";

export default function ManagerEmployeesPage() {
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const departments = Array.from(new Set(MOCK_EMPLOYEES.map((e) => e.department))).sort();
  const filtered = deptFilter
    ? MOCK_EMPLOYEES.filter((e) => e.department === deptFilter)
    : MOCK_EMPLOYEES;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="mt-1 text-gray-600">Programme participation and progress by employee.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDeptFilter(null)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            !deptFilter ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {departments.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDeptFilter(d)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              deptFilter === d ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <Card>
        <CardTitle>Employee table</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label="Employee progress">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 pr-4 font-medium">Name</th>
                <th className="pb-2 pr-4 font-medium">Email</th>
                <th className="pb-2 pr-4 font-medium">Department</th>
                <th className="pb-2 pr-4 font-medium">Weeks completed</th>
                <th className="pb-2 pr-4 font-medium">Completion</th>
                <th className="pb-2 pr-4 font-medium">Performance</th>
                <th className="pb-2 font-medium">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">{e.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{e.email}</td>
                  <td className="py-3 pr-4">{e.department}</td>
                  <td className="py-3 pr-4">{e.completedWeeks} / 12</td>
                  <td className="py-3 pr-4">
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-primary-600"
                        style={{ width: `${(e.completedWeeks / 12) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 pr-4">{e.performanceScore}</td>
                  <td className="py-3">{e.engagementLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
