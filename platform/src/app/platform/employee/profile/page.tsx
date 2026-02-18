"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/lib/context/auth-context";

export default function ProfilePage() {
  const { employee } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile / Settings</h1>
        <p className="mt-1 text-gray-600">Your account details (simulated). Real auth can replace this later.</p>
      </div>

      <Card>
        <CardTitle>Profile</CardTitle>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Name</dt>
            <dd className="text-gray-900">{employee?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Email</dt>
            <dd className="text-gray-900">{employee?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Department</dt>
            <dd className="text-gray-900">{employee?.department ?? "—"}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <CardTitle>Settings</CardTitle>
        <p className="mt-2 text-sm text-gray-500">Notifications, preferences, and security will go here when real auth is added.</p>
      </Card>
    </div>
  );
}
