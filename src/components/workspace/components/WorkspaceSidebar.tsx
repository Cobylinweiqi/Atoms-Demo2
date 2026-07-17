"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import { WORKSPACE_TABS, type WorkspaceTab } from "../types";

// ═══════════════════════════════════════════════════════════════
// WorkspaceSidebar — 左侧导航栏
// 项目信息 + 环境切换 + Tab 导航
// ═══════════════════════════════════════════════════════════════

interface WorkspaceSidebarProps {
  className?: string;
}

export function WorkspaceSidebar({ className }: WorkspaceSidebarProps) {
  const activeTab = useWorkspaceStore((s) => s.activeTab);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const project = useWorkspaceStore((s) => s.currentProject);
  const environments = useWorkspaceStore((s) => s.environments);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const setActiveEnv = useWorkspaceStore((s) => s.setActiveEnvironment);

  return (
    <div className={cn("flex h-full w-56 shrink-0 flex-col border-r border-border/[0.06] bg-background", className)}>
      {/* ─── 项目信息 ─── */}
      <div className="glass-nav flex items-center gap-2.5 border-b border-border/[0.06] px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-xs font-bold text-white shadow-glow">
          {project?.name.charAt(0).toUpperCase() ?? "P"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-foreground">{project?.name}</div>
          <div className="truncate text-[10px] text-muted-foreground/50">{project?.framework}</div>
        </div>
        <LucideIcons.ChevronDown size={14} className="text-muted-foreground/40" />
      </div>

      {/* ─── 环境切换 ─── */}
      <div className="border-b border-border/[0.06] px-3 py-2.5">
        <div className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
          Environment
        </div>
        <div className="flex flex-col gap-0.5">
          {environments.map((env) => (
            <button
              key={env.id}
              onClick={() => setActiveEnv(env.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                activeEnvId === env.id
                  ? "bg-foreground/8 text-foreground"
                  : "text-muted-foreground/60 hover:bg-foreground/4 hover:text-foreground",
              )}
            >
              <EnvStatusDot status={env.status} />
              <span className="flex-1 truncate">{env.name}</span>
              {env.isDefault && (
                <LucideIcons.Star size={10} className="text-primary/50 fill-current" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab 导航 ─── */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
          Workspace
        </div>
        <div className="flex flex-col gap-0.5">
          {WORKSPACE_TABS.map((tab) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[tab.icon] ?? LucideIcons.Circle;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-brand-soft text-primary"
                    : "text-muted-foreground/60 hover:bg-foreground/4 hover:text-foreground",
                )}
              >
                <Icon size={14} className={activeTab === tab.id ? "text-primary" : "text-muted-foreground/40"} />
                <span className="flex-1 truncate font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 底部状态 ─── */}
      <div className="border-t border-border/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
          <LucideIcons.GitBranch size={10} />
          <span className="font-mono">main</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Live
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── 环境状态圆点 ───
function EnvStatusDot({ status }: { status: string }) {
  const color = {
    active: "bg-success",
    sleeping: "bg-muted-foreground/30",
    building: "bg-warning animate-pulse",
    error: "bg-destructive",
  }[status] ?? "bg-muted-foreground/30";

  return <span className={cn("h-2 w-2 shrink-0 rounded-full", color)} />;
}
