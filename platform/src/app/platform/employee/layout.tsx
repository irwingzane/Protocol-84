"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Sidebar } from "@/components/layout/Sidebar";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role !== undefined && role !== null && role !== "employee") {
      router.replace("/platform");
    }
  }, [role, router]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
      <Sidebar variant="employee" />
      <main className="md:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
