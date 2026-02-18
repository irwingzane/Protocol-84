"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Role } from "@/types";
import { getDefaultEmployee, getEmployeeById } from "@/lib/mock-data/employees";
import type { EmployeeProfile } from "@/types";

const STORAGE_KEY = "protocol84_simulated_user";

type AuthState = {
  role: Role | null;
  employeeId: string | null;
  employee: EmployeeProfile | null;
};

type AuthContextValue = AuthState & {
  setEmployeeView: (employeeId?: string) => void;
  setManagerView: () => void;
  signOut: () => void;
};

const defaultState: AuthState = {
  role: null,
  employeeId: null,
  employee: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { role: Role; employeeId?: string };
      if (parsed.role === "employee") {
        const emp = parsed.employeeId ? getEmployeeById(parsed.employeeId) : getDefaultEmployee();
        if (emp) setState({ role: "employee", employeeId: emp.id, employee: emp });
      } else if (parsed.role === "manager") {
        setState({ role: "manager", employeeId: null, employee: null });
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((role: Role, employeeId: string | null) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ role, employeeId }));
  }, []);

  const setEmployeeView = useCallback(
    (employeeId?: string) => {
      const emp = employeeId ? getEmployeeById(employeeId) : getDefaultEmployee();
      if (!emp) return;
      setState({ role: "employee", employeeId: emp.id, employee: emp });
      persist("employee", emp.id);
    },
    [persist]
  );

  const setManagerView = useCallback(() => {
    setState({ role: "manager", employeeId: null, employee: null });
    persist("manager", null);
  }, [persist]);

  const signOut = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("protocol84_progress");
  }, []);

  const value: AuthContextValue = {
    ...state,
    setEmployeeView,
    setManagerView,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
