"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import { ResponsiveSwitch } from "./ResponsiveSwitch";
import { HistoryControls } from "./HistoryControls";
import { HistoryPanel } from "./HistoryPanel";

export function EditorToolbar() {
  const { toggleHistory, showHistory } = useEditorStore();

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/[0.06] bg-foreground/[0.01]">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <LucideIcons.LayoutGrid size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Visual Editor</span>
        </div>

        {/* Center: Responsive Switch */}
        <ResponsiveSwitch />

        {/* Right: History Controls */}
        <div className="flex items-center gap-2">
          <HistoryControls />

          {/* 分割线 */}
          <div className="w-px h-5 bg-foreground/[0.06]" />

          {/* History Panel Toggle */}
          <button
            onClick={toggleHistory}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
              showHistory
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
            }`}
            title="History"
          >
            <LucideIcons.History size={13} />
            <span className="text-xs">History</span>
          </button>
        </div>
      </div>

      {/* History Panel (展开时显示) */}
      <HistoryPanel />
    </div>
  );
}
