"use client";

import React from "react";

interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function NumberField({ value, onChange, min, max, step, unit }: NumberFieldProps) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="flex-1 h-9 rounded-lg bg-foreground/[0.03] border border-border/[0.06] px-3 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-colors"
      />
      {unit && (
        <span className="text-xs text-muted-foreground w-8 text-center">{unit}</span>
      )}
    </div>
  );
}
