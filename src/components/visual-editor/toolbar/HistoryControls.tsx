"use client";

import React, { useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";

export function HistoryControls() {
  const { past, future, undo, redo } = useEditorStore();

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // ─── 键盘快捷键 ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Z → Undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y → Redo
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`flex items-center justify-center w-8 h-7 rounded-md transition-colors ${
          canUndo
            ? "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
            : "text-muted-foreground/30 cursor-not-allowed"
        }`}
        title="Undo (⌘Z)"
      >
        <LucideIcons.Undo2 size={14} />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`flex items-center justify-center w-8 h-7 rounded-md transition-colors ${
          canRedo
            ? "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
            : "text-muted-foreground/30 cursor-not-allowed"
        }`}
        title="Redo (⌘⇧Z)"
      >
        <LucideIcons.Redo2 size={14} />
      </button>
    </div>
  );
}
