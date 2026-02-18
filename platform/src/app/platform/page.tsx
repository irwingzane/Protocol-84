"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setEmployeeView, setManagerView } = useAuth();

  const handleEmployee = () => {
    setEmployeeView();
    router.push("/platform/employee/dashboard");
  };

  const handleManager = () => {
    setManagerView();
    router.push("/platform/manager");
  };

  return (
    <main className="min-h-[80vh] bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-20">
        <h1 className="text-3xl font-bold text-gray-900">Choose your view</h1>
        <p className="mt-2 text-gray-600">Select how you want to use the platform. No login required (simulated).</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleEmployee}
            className="flex flex-col items-start rounded-xl border border-gray-200 bg-white p-6 text-left shadow-card transition-smooth hover:border-primary-200 hover:shadow-md"
          >
            <span className="text-2xl font-semibold text-primary-600">Employee View</span>
            <span className="mt-2 text-sm text-gray-600">Access your dashboard, 12-week plan, workouts, nutrition, and metrics.</span>
          </button>
          <button
            type="button"
            onClick={handleManager}
            className="flex flex-col items-start rounded-xl border border-gray-200 bg-white p-6 text-left shadow-card transition-smooth hover:border-primary-200 hover:shadow-md"
          >
            <span className="text-2xl font-semibold text-primary-600">Manager View</span>
            <span className="mt-2 text-sm text-gray-600">View team progress, engagement, and company-wide analytics.</span>
          </button>
        </div>
      </div>
    </main>
  );
}
