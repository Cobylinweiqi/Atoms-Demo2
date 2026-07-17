// ═══════════════════════════════════════════════════════════════
// TextField — 文本/文本域输入控件
// ═══════════════════════════════════════════════════════════════

"use client";

import React from "react";

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function TextField({ value, onChange, placeholder, multiline }: TextFieldProps) {
  const baseClass =
    "w-full rounded-lg bg-foreground/[0.03] border border-border/[0.06] px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors";

  if (multiline) {
    return (
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`${baseClass} py-2 resize-y min-h-[60px] font-sans`}
      />
    );
  }

  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${baseClass} h-9`}
    />
  );
}
