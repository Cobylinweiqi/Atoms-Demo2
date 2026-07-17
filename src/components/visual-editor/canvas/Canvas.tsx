"use client";

import React from "react";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import { CanvasRenderer } from "./CanvasRenderer";
import type { Viewport } from "@/components/visual-editor/types";

const VIEWPORT_SIZES: Record<Viewport, { width: string; maxWidth: string; label: string }> = {
  desktop: { width: "100%", maxWidth: "100%", label: "Desktop" },
  tablet: { width: "768px", maxWidth: "768px", label: "Tablet" },
  mobile: { width: "375px", maxWidth: "375px", label: "Mobile" },
};

export function Canvas() {
  const { tree, viewport, selectNode } = useEditorStore();
  const size = VIEWPORT_SIZES[viewport];

  return (
    <div
      className="flex-1 overflow-auto bg-background dot-grid relative"
      onClick={() => selectNode(null)}
    >
      {/* 画布容器 */}
      <div className="min-h-full flex items-start justify-center p-8">
        <div
          className="bg-surface-1 rounded-2xl shadow-2xl border border-border/[0.06] w-full transition-all duration-300"
          style={{
            maxWidth: size.maxWidth,
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {/* 画布标尺条 */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/[0.04] bg-foreground/[0.01]">
            <span className="text-[10px] text-muted-foreground font-mono">
              {size.label}
            </span>
            <span className="text-[10px] text-muted-foreground/60 font-mono">
              {size.width === "100%" ? "Full Width" : size.width}
            </span>
          </div>

          {/* 画布内容 */}
          <div
            className="p-4 min-h-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <CanvasRenderer nodes={tree} />
          </div>
        </div>
      </div>
    </div>
  );
}
