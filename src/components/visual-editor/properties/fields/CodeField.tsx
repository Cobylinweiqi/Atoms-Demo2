"use client";

import React from "react";

interface CodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CodeField({ value, onChange, placeholder }: CodeFieldProps) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-9 rounded-lg bg-foreground/[0.03] border border-border/[0.06] px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors font-mono text-[13px]"
    />
  );
}
