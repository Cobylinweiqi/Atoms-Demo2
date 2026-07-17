"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import type { HistoryActionType } from "@/components/visual-editor/types";

const ACTION_ICONS: Record<HistoryActionType, keyof typeof LucideIcons> = {
  add: "PlusCircle",
  delete: "Trash2",
  move: "Move",
  duplicate: "Copy",
  "update-props": "Settings2",
  "update-styles": "Palette",
  "toggle-visible": "Eye",
  "toggle-lock": "Lock",
};

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 5000) return "just now";
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return new Date(timestamp).toLocaleTimeString();
}

export function HistoryPanel() {
  const { past, future, showHistory, toggleHistory, jumpTo, tree } = useEditorStore();

  if (!showHistory) return null;

  // 合并 past (逆序) + current + future
  const allEntries = [
    ...[...past].reverse().map((e, i) => ({ ...e, status: "past" as const, index: i })),
    {
      id: "current",
      timestamp: Date.now(),
      action: "update-styles" as HistoryActionType,
      label: "Current state",
      nodeId: undefined,
      snapshot: tree,
      status: "current" as const,
      index: past.length,
    },
    ...future.map((e, i) => ({ ...e, status: "future" as const, index: past.length + 1 + i })),
  ];

  return (
    <div className="absolute top-full left-0 right-0 mt-1 mx-3 rounded-lg glass shadow-xl border border-border/[0.06] max-h-[400px] overflow-hidden z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/[0.06]">
        <div className="flex items-center gap-2">
          <LucideIcons.History size={13} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">History</span>
          <span className="text-[10px] text-muted-foreground/60">
            ({allEntries.length})
          </span>
        </div>
        <button
          onClick={toggleHistory}
          className="p-1 rounded hover:bg-foreground/[0.04] text-muted-foreground hover:text-foreground transition-colors"
        >
          <LucideIcons.X size={12} />
        </button>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto py-1">
        {allEntries.map((entry) => {
          const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[ACTION_ICONS[entry.action]] ?? LucideIcons.Circle;
          const isCurrent = entry.status === "current";

          return (
            <button
              key={entry.id}
              onClick={() => {
                if (!isCurrent) jumpTo(entry.id);
              }}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-left transition-colors ${
                isCurrent
                  ? "bg-primary/10"
                  : "hover:bg-foreground/[0.03]"
              } ${entry.status === "future" ? "opacity-40" : ""}`}
            >
              <IconComp size={12} className={isCurrent ? "text-primary" : "text-muted-foreground"} />
              <span className={`text-xs flex-1 truncate ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {entry.label}
              </span>
              <span className="text-[10px] text-muted-foreground/50 font-mono">
                {isCurrent ? "now" : formatTime(entry.timestamp)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
