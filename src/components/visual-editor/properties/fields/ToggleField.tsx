"use client";

import React from "react";

interface ToggleFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleField({ value, onChange }: ToggleFieldProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        value ? "bg-primary" : "bg-foreground/[0.08]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
