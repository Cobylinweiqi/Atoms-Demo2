"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import type { HistoryAction, HistoryEntry } from "../types";

// ═══════════════════════════════════════════════════════════════
// HistoryTimeline — 历史时间线
// 展示: 按时间排列的操作历史 / 操作类型过滤 / 回滚
// ═══════════════════════════════════════════════════════════════

const ACTION_CONFIG: Record<HistoryAction, { icon: LucideIcons.LucideIcon; color: string; bg: string; label: string }> = {
  create: { icon: LucideIcons.Plus, color: "text-success", bg: "bg-success/10", label: "Created" },
  update: { icon: LucideIcons.Edit, color: "text-primary", bg: "bg-primary/10", label: "Updated" },
  delete: { icon: LucideIcons.Trash, color: "text-destructive", bg: "bg-destructive/10", label: "Deleted" },
  deploy: { icon: LucideIcons.Rocket, color: "text-warning", bg: "bg-warning/10", label: "Deployed" },
  rollback: { icon: LucideIcons.Undo, color: "text-destructive", bg: "bg-destructive/10", label: "Rolled Back" },
  config: { icon: LucideIcons.Settings, color: "text-muted-foreground", bg: "bg-foreground/5", label: "Configured" },
};

const TARGET_ICONS: Record<string, LucideIcons.LucideIcon> = {
  file: LucideIcons.FileCode,
  deployment: LucideIcons.Rocket,
  environment_variable: LucideIcons.KeyRound,
  auth: LucideIcons.ShieldCheck,
  database: LucideIcons.Database,
  storage: LucideIcons.HardDrive,
};

export function HistoryTimeline() {
  const history = useWorkspaceStore((s) => s.history);
  const environments = useWorkspaceStore((s) => s.environments);

  // 按日期分组
  const grouped = groupByDate(history);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">History</h2>
        <span className="text-xs text-muted-foreground/40">{history.length} events</span>
      </div>

      {/* ─── 时间线 ─── */}
      <div className="relative">
        {/* 垂直线 */}
        <div className="absolute left-[19px] top-2 h-full w-px bg-border/[0.06]" />

        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date} className="mb-6">
            {/* 日期标题 */}
            <div className="mb-3 flex items-center gap-3">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border/[0.08] bg-background">
                <LucideIcons.Calendar size={14} className="text-muted-foreground/40" />
              </div>
              <span className="text-sm font-semibold text-foreground">{date}</span>
              <span className="text-[10px] text-muted-foreground/30">{entries.length} events</span>
            </div>

            {/* 事件列表 */}
            <div className="ml-3 space-y-1 border-l-2 border-transparent">
              {entries.map((entry) => {
                const config = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.update;
                const ActionIcon = config.icon;
                const TargetIcon = TARGET_ICONS[entry.targetType] ?? LucideIcons.Circle;
                const env = environments.find((e) => e.id === entry.environmentId);

                return (
                  <div
                    key={entry.id}
                    className="group relative flex items-start gap-3 rounded-xl border border-border/[0.04] bg-foreground/[0.01] p-3 pl-10 hover:border-border/[0.08] hover:bg-foreground/[0.02]"
                  >
                    {/* 时间线圆点 */}
                    <div className={cn("absolute left-[-0px] top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background", config.bg)}>
                      <ActionIcon size={11} className={config.color} />
                    </div>

                    {/* 内容 */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{entry.description}</span>
                        <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-medium uppercase", config.bg, config.color)}>
                          {config.label}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                        <span className="flex items-center gap-1">
                          <TargetIcon size={10} />
                          {entry.targetType}
                        </span>
                        {env && (
                          <span className="flex items-center gap-1">
                            <LucideIcons.Server size={10} />
                            {env.name}
                          </span>
                        )}
                        <span>{formatTime(entry.createdAt)}</span>
                      </div>
                    </div>

                    {/* 回滚按钮 (deploy/update 时显示) */}
                    {(entry.action === "deploy" || entry.action === "update") && (
                      <button className="shrink-0 rounded-lg p-1.5 text-muted-foreground/20 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100" title="Rollback">
                        <LucideIcons.Undo size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 按日期分组 ───
function groupByDate(entries: HistoryEntry[]): Record<string, HistoryEntry[]> {
  const groups: Record<string, HistoryEntry[]> = {};
  for (const entry of entries) {
    const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
  }
  return groups;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
