"use client";

import React, { useState } from "react";

interface ColorFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const PRESET_COLORS = [
  "#FAFAFA", "#A1A1AA", "#71717A", "#52525B",
  "#6366F1", "#8B5CF6", "#06B6D4", "#A5B4FC",
  "#10B981", "#F59E0B", "#EF4444", "#3B82F6",
  "rgba(255,255,255,0.03)", "rgba(255,255,255,0.05)",
  "rgba(255,255,255,0.08)", "transparent",
];

export function ColorField({ value, onChange }: ColorFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="h-9 w-9 shrink-0 rounded-lg border border-border/[0.06] overflow-hidden relative"
          style={{
            background: value || "transparent",
            backgroundImage:
              !value || value === "transparent"
                ? "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)"
                : undefined,
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 4px 4px",
          }}
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 h-9 rounded-lg bg-foreground/[0.03] border border-border/[0.06] px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors font-mono"
        />
      </div>

      {showPicker && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg glass shadow-lg z-50">
          <div className="grid grid-cols-8 gap-1">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setShowPicker(false);
                }}
                className="h-6 w-6 rounded border border-border/[0.06] hover:scale-110 transition-transform"
                style={{
                  background: color,
                  backgroundImage:
                    color === "transparent"
                      ? "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)"
                      : undefined,
                  backgroundSize: "6px 6px",
                }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={value && value.startsWith("#") ? value : "#6366F1"}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full h-8 rounded cursor-pointer bg-transparent"
          />
        </div>
      )}
    </div>
  );
}
