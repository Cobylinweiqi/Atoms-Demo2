"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import type { Viewport } from "@/components/visual-editor/types";

export function ResponsiveSwitch() {
  const { viewport, setViewport } = useEditorStore();

  const viewports: { id: Viewport; icon: keyof typeof LucideIcons; label: string }[] = [
    { id: "desktop", icon: "Monitor", label: "Desktop" },
    { id: "tablet", icon: "Tablet", label: "Tablet" },
    { id: "mobile", icon: "Smartphone", label: "Mobile" },
  ];

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-foreground/[0.03] border border-border/[0.06]">
      {viewports.map((vp) => {
        const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[vp.icon] ?? LucideIcons.Monitor;
        const isActive = viewport === vp.id;
        return (
          <button
            key={vp.id}
            onClick={() => setViewport(vp.id)}
            className={`flex items-center justify-center w-8 h-7 rounded-md transition-colors ${
              isActive
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
            }`}
            title={vp.label}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}
