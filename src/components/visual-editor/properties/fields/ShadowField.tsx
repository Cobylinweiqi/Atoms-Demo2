"use client";

import React from "react";
import type { ShadowValue } from "@/components/visual-editor/types";
import { ColorField } from "./ColorField";

interface ShadowFieldProps {
  value: ShadowValue | undefined;
  onChange: (value: ShadowValue) => void;
}

const DEFAULT_SHADOW: ShadowValue = {
  x: 0,
  y: 4,
  blur: 16,
  spread: 0,
  color: "hsl(var(--foreground) / 0.16)",
  inset: false,
};

export function ShadowField({ value, onChange }: ShadowFieldProps) {
  const shadow = value ?? DEFAULT_SHADOW;

  const update = (partial: Partial<ShadowValue>) => {
    onChange({ ...shadow, ...partial });
  };

  const numInput =
    "w-full h-7 rounded-md bg-foreground/[0.03] border border-border/[0.06] px-2 text-xs text-foreground text-center focus:outline-none focus:border-primary/40 transition-colors font-mono";

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-1">
        <div>
          <label className="text-[10px] text-muted-foreground block text-center mb-0.5">X</label>
          <input
            type="number"
            value={shadow.x}
            onChange={(e) => update({ x: parseInt(e.target.value) || 0 })}
            className={numInput}
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block text-center mb-0.5">Y</label>
          <input
            type="number"
            value={shadow.y}
            onChange={(e) => update({ y: parseInt(e.target.value) || 0 })}
            className={numInput}
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block text-center mb-0.5">Blur</label>
          <input
            type="number"
            value={shadow.blur}
            onChange={(e) => update({ blur: parseInt(e.target.value) || 0 })}
            className={numInput}
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block text-center mb-0.5">Spread</label>
          <input
            type="number"
            value={shadow.spread}
            onChange={(e) => update({ spread: parseInt(e.target.value) || 0 })}
            className={numInput}
          />
        </div>
      </div>
      <ColorField value={shadow.color} onChange={(c) => update({ color: c })} />
      <div className="flex items-center gap-2">
        <button
          onClick={() => update({ inset: !shadow.inset })}
          className={`h-7 px-2 rounded-md text-[10px] transition-colors ${
            shadow.inset
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-muted-foreground border border-border/[0.06] hover:text-foreground"
          }`}
        >
          Inset
        </button>
        <button
          onClick={() => onChange(DEFAULT_SHADOW)}
          className="h-7 px-2 rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
