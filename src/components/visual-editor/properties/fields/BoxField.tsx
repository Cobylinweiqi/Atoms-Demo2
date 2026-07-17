"use client";

import React from "react";
import type { SpacingBox } from "@/components/visual-editor/types";

interface BoxFieldProps {
  value: SpacingBox | string | undefined;
  onChange: (value: SpacingBox) => void;
}

function ensureBox(val: SpacingBox | string | undefined): SpacingBox {
  if (!val || typeof val === "string") {
    const v = typeof val === "string" ? val : "0px";
    return { top: v, right: v, bottom: v, left: v };
  }
  return val;
}

export function BoxField({ value, onChange }: BoxFieldProps) {
  const box = ensureBox(value);

  const update = (side: keyof SpacingBox, val: string) => {
    onChange({ ...box, [side]: val });
  };

  const inputClass =
    "w-full h-7 rounded-md bg-foreground/[0.03] border border-border/[0.06] px-2 text-xs text-foreground text-center focus:outline-none focus:border-primary/40 transition-colors font-mono";

  return (
    <div className="space-y-1.5">
      {/* 四方向输入 */}
      <div className="grid grid-cols-4 gap-1">
        <div>
          <label className="text-[10px] text-muted-foreground block text-center mb-0.5">T</label>
          <input
            type="text"
            value={box.top}
            onChange={(e) => update("top", e.target.value)}
            className={inputClass}
            placeholder="0px"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block text-center mb-0.5">R</label>
          <input
            type="text"
            value={box.right}
            onChange={(e) => update("right", e.target.value)}
            className={inputClass}
            placeholder="0px"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block text-center mb-0.5">B</label>
          <input
            type="text"
            value={box.bottom}
            onChange={(e) => update("bottom", e.target.value)}
            className={inputClass}
            placeholder="0px"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block text-center mb-0.5">L</label>
          <input
            type="text"
            value={box.left}
            onChange={(e) => update("left", e.target.value)}
            className={inputClass}
            placeholder="0px"
          />
        </div>
      </div>
      {/* 快捷: 全部统一 */}
      <div className="flex items-center gap-1">
        <input
          type="text"
          placeholder="all"
          className="flex-1 h-7 rounded-md bg-foreground/[0.03] border border-border/[0.06] px-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors font-mono"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value;
              if (val) onChange({ top: val, right: val, bottom: val, left: val });
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <button
          onClick={() => onChange({ top: "0px", right: "0px", bottom: "0px", left: "0px" })}
          className="h-7 px-2 rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
