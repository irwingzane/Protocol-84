"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const EMPLOYEE_LINKS = [
  { href: "/platform/employee/dashboard", label: "Dashboard" },
  { href: "/platform/employee/12-week-plan", label: "12 Week Performance Plan" },
  { href: "/platform/employee/workouts", label: "On Demand Workouts" },
  { href: "/platform/employee/nutrition", label: "Nutrition Plans" },
  { href: "/platform/employee/mental-health", label: "Mental Health Zone" },
  { href: "/platform/employee/metrics", label: "Performance Metrics" },
  { href: "/platform/employee/profile", label: "Profile / Settings" },
];

const MANAGER_LINKS = [
  { href: "/platform/manager", label: "Overview" },
  { href: "/platform/manager/employees", label: "Employees" },
];

interface SidebarProps {
  variant: "employee" | "manager";
}

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = variant === "employee" ? EMPLOYEE_LINKS : MANAGER_LINKS;

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-20 z-50 rounded-lg bg-primary-600 p-2 text-white shadow md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}
      <aside
        className={`
          fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-gray-200 bg-white shadow-soft
          transition-transform duration-200 ease-out
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="flex flex-col gap-0.5 p-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`
                  rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth
                  ${isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
