"use client";

import React from "react";
import type { SelectOption } from "@/components/visual-editor/types";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export function SelectField({ value, onChange, options }: SelectFieldProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 rounded-lg bg-foreground/[0.03] border border-border/[0.06] px-3 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-colors cursor-pointer appearance-none"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        backgroundSize: "12px",
        paddingRight: "30px",
      }}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-surface-1 text-foreground"
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}
