"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";

// ═══════════════════════════════════════════════════════════════
// PreviewFrame — 预览 iframe
// 展示: 当前环境的预览页面 / 响应式切换 / 刷新 / 新标签打开
// ═══════════════════════════════════════════════════════════════

type ViewportSize = "desktop" | "tablet" | "mobile";

const VIEWPORT_SIZES: Record<ViewportSize, { width: string; icon: LucideIcons.LucideIcon; label: string }> = {
  desktop: { width: "100%", icon: LucideIcons.Monitor, label: "Desktop" },
  tablet: { width: "768px", icon: LucideIcons.Tablet, label: "Tablet" },
  mobile: { width: "375px", icon: LucideIcons.Smartphone, label: "Mobile" },
};

export function PreviewFrame() {
  const environments = useWorkspaceStore((s) => s.environments);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  const activeEnv = environments.find((e) => e.id === activeEnvId);
  const previewUrl = activeEnv?.url ?? "about:blank";
  const vpConfig = VIEWPORT_SIZES[viewport];

  return (
    <div className="flex h-full flex-col">
      {/* ─── 工具栏 ─── */}
      <div className="flex items-center gap-2 border-b border-border/[0.06] px-4 py-2.5">
        <span className="text-sm font-semibold text-foreground">Preview</span>

        {/* URL 栏 */}
        <div className="ml-2 flex items-center gap-1.5 rounded-lg bg-foreground/5 px-3 py-1">
          <LucideIcons.Lock size={11} className="text-success" />
          <span className="truncate font-mono text-[11px] text-muted-foreground/60">{previewUrl}</span>
        </div>

        {/* 响应式切换 */}
        <div className="ml-2 flex items-center gap-0.5 rounded-lg bg-foreground/5 p-0.5">
          {(Object.keys(VIEWPORT_SIZES) as ViewportSize[]).map((vp) => {
            const Icon = VIEWPORT_SIZES[vp].icon;
            return (
              <button
                key={vp}
                onClick={() => setViewport(vp)}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewport === vp ? "bg-foreground/10 text-foreground" : "text-muted-foreground/40 hover:text-foreground",
                )}
                title={VIEWPORT_SIZES[vp].label}
              >
                <Icon size={13} />
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="rounded-lg p-1.5 text-muted-foreground/50 hover:bg-foreground/5 hover:text-foreground"
            title="Refresh"
          >
            <LucideIcons.RefreshCw size={13} />
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-1.5 text-muted-foreground/50 hover:bg-foreground/5 hover:text-foreground"
            title="Open in new tab"
          >
            <LucideIcons.ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* ─── iframe ─── */}
      <div className="flex flex-1 items-start justify-center overflow-auto bg-foreground/[0.02] p-4">
        <div
          className="h-full overflow-hidden rounded-xl border border-border/[0.08] bg-background shadow-lg transition-all"
          style={{ width: vpConfig.width, maxWidth: "100%" }}
        >
          <iframe
            key={refreshKey}
            src={previewUrl}
            className="h-full w-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>

      {/* ─── 状态栏 ─── */}
      <div className="flex items-center justify-between border-t border-border/[0.06] px-4 py-1.5 text-[10px] text-muted-foreground/40">
        <span className="flex items-center gap-1">
          <LucideIcons.Server size={10} />
          {activeEnv?.name} ({activeEnv?.type})
        </span>
        <span>{vpConfig.label} · {vpConfig.width}</span>
      </div>
    </div>
  );
}
