import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar(props: ProgressBarProps) {
  const { value, max = 100, showLabel = true, className = "" } = props;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={className}>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-sm text-gray-500">
          {value} of {max} ({Math.round(percent)}%)
        </p>
      )}
    </div>
  );
}
