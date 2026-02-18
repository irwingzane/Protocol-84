"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/Button";

const MARKETING_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#programme", label: "Programme" },
  { href: "/#benefits", label: "Benefits" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMarketing = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-soft">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.PNG" alt="Protocol84" className="h-10 w-auto object-contain" />
          <span className="text-xl font-semibold text-primary-600">Protocol84</span>
        </Link>

        {isMarketing ? (
          <>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
              {MARKETING_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" href="/#pricing">
                See pricing
              </Button>
              <Button href="/platform">Login</Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {role ? (
              <>
                <Button variant="ghost" onClick={signOut}>
                  Sign out
                </Button>
                <Link
                  href={role === "employee" ? "/platform/employee/dashboard" : "/platform/manager"}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {role === "employee" ? "Dashboard" : "Manager"}
                </Link>
              </>
            ) : (
              <Button href="/platform">Login</Button>
            )}
          </div>
        )}

        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMarketing && mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {MARKETING_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="py-2 text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/#pricing" className="py-2 text-sm font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>
              See pricing
            </Link>
            <Link href="/platform" className="inline-flex py-2 text-sm font-medium text-primary-600" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
