import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-soft",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-smooth disabled:opacity-50 disabled:cursor-not-allowed " + variants[variant];

  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${className}`}>
      {children}
    </button>
  );
}
