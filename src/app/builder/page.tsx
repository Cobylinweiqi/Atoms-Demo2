"use client";

import React from "react";
import { BuilderWorkspace } from "@/components/ai-builder/components/BuilderChat";

// ═══════════════════════════════════════════════════════════════
// AI Builder Page — /builder
// 展示完整 AI Builder 工作区
// ═══════════════════════════════════════════════════════════════

export default function BuilderPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <BuilderWorkspace />
    </div>
  );
}
