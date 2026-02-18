"use client";

import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MOCK_EMPLOYEES } from "@/lib/mock-data/employees";

export default function ManagerDashboardPage() {
  const total = MOCK_EMPLOYEES.length;
  const completed = MOCK_EMPLOYEES.filter((e) => e.completedWeeks >= 12).length;
  const avgProgress = total ? Math.round(MOCK_EMPLOYEES.reduce((s, e) => s + (e.completedWeeks / 12) * 100, 0) / total) : 0;
  const avgEngagement = total ? Math.round(MOCK_EMPLOYEES.reduce((s, e) => s + e.engagementLevel, 0) / total) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organisation overview</h1>
        <p className="mt-1 text-gray-600">Team progress and engagement at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardTitle className="text-base">Total employees</CardTitle>
          <p className="mt-2 text-3xl font-bold text-gray-900">{total}</p>
        </Card>
        <Card>
          <CardTitle className="text-base">Programme completed</CardTitle>
          <p className="mt-2 text-3xl font-bold text-gray-900">{completed}</p>
          <p className="text-sm text-gray-500">of {total} employees</p>
        </Card>
        <Card>
          <CardTitle className="text-base">Average progress</CardTitle>
          <p className="mt-2 text-3xl font-bold text-gray-900">{avgProgress}%</p>
        </Card>
        <Card>
          <CardTitle className="text-base">Avg engagement</CardTitle>
          <p className="mt-2 text-3xl font-bold text-gray-900">{avgEngagement}</p>
        </Card>
      </div>

      <Card>
        <CardTitle>Company-wide completion</CardTitle>
        <div className="mt-4">
          <ProgressBar value={Math.round((completed / total) * 100)} max={100} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>Employee list</CardTitle>
          <Link href="/platform/manager/employees" className="text-sm font-medium text-primary-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 pr-4 font-medium">Name</th>
                <th className="pb-2 pr-4 font-medium">Department</th>
                <th className="pb-2 pr-4 font-medium">Weeks completed</th>
                <th className="pb-2 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EMPLOYEES.slice(0, 5).map((e) => (
                <tr key={e.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">{e.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{e.department}</td>
                  <td className="py-3 pr-4">{e.completedWeeks} / 12</td>
                  <td className="py-3">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-primary-600"
                        style={{ width: `${(e.completedWeeks / 12) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
