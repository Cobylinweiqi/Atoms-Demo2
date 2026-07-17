"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "./stores/workspace-store";
import { WORKSPACE_TABS } from "./types";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";
import { ProjectOverview } from "./components/ProjectOverview";
import { FolderTree } from "./components/FolderTree";
import { EnvironmentManager } from "./components/EnvironmentManager";
import { DeployPanel } from "./components/DeployPanel";
import { GitPanel } from "./components/GitPanel";
import { LogViewer } from "./components/LogViewer";
import { PreviewFrame } from "./components/PreviewFrame";
import { TerminalEmulator } from "./components/TerminalEmulator";
import { DatabaseExplorer } from "./components/DatabaseExplorer";
import { StorageBrowser } from "./components/StorageBrowser";
import { ApiManager } from "./components/ApiManager";
import { AuthConfig } from "./components/AuthConfig";
import { BillingPanel } from "./components/BillingPanel";
import { HistoryTimeline } from "./components/HistoryTimeline";

// ═══════════════════════════════════════════════════════════════
// ProjectWorkspace — 项目工作区主容器
// 集成: 侧栏导航 + 多 Tab 内容区 + 环境上下文
// ═══════════════════════════════════════════════════════════════

export function ProjectWorkspace() {
  const activeTab = useWorkspaceStore((s) => s.activeTab);
  const environments = useWorkspaceStore((s) => s.environments);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const setActiveEnv = useWorkspaceStore((s) => s.setActiveEnvironment);

  const activeEnv = environments.find((e) => e.id === activeEnvId);
  const tabConfig = WORKSPACE_TABS.find((t) => t.id === activeTab);

  // 全屏 Tab (不需要环境切换栏)
  const isFullHeightTab = ["logs", "preview", "terminal", "database", "storage"].includes(activeTab);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* ─── 左侧导航 ─── */}
      <WorkspaceSidebar />

      {/* ─── 主内容区 ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ─── 顶部环境栏 ─── */}
        <div className="flex items-center gap-3 border-b border-border/[0.06] px-4 py-2">
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[tabConfig?.icon ?? "Circle"] ?? LucideIcons.Circle;
              return <Icon size={15} className="text-primary/60" />;
            })()}
            <span className="text-sm font-semibold text-foreground">{tabConfig?.label}</span>
            <span className="text-[10px] text-muted-foreground/30">{tabConfig?.description}</span>
          </div>

          {/* 环境切换器 */}
          {!isFullHeightTab && activeTab !== "overview" && activeTab !== "billing" && activeTab !== "auth" && activeTab !== "api" && activeTab !== "history" && (
            <div className="ml-auto flex items-center gap-1">
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => setActiveEnv(env.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors",
                    activeEnvId === env.id
                      ? "bg-foreground/8 text-foreground"
                      : "text-muted-foreground/50 hover:bg-foreground/4 hover:text-foreground",
                  )}
                >
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    env.status === "active" ? "bg-success"
                    : env.status === "building" ? "bg-warning animate-pulse"
                    : env.status === "error" ? "bg-destructive"
                    : "bg-muted-foreground/30",
                  )} />
                  {env.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── 内容区 ─── */}
        <div className="flex-1 overflow-hidden">
          {renderTabContent(activeTab)}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 内容路由 ───
function renderTabContent(tab: string): React.ReactNode {
  switch (tab) {
    case "overview":
      return (
        <div className="h-full overflow-y-auto">
          <ProjectOverview />
        </div>
      );
    case "files":
      return <FolderTree />;
    case "environments":
      return (
        <div className="h-full overflow-y-auto">
          <EnvironmentManager />
        </div>
      );
    case "deploy":
      return (
        <div className="h-full overflow-y-auto">
          <DeployPanel />
        </div>
      );
    case "git":
      return (
        <div className="h-full overflow-y-auto">
          <GitPanel />
        </div>
      );
    case "logs":
      return <LogViewer />;
    case "preview":
      return <PreviewFrame />;
    case "terminal":
      return <TerminalEmulator />;
    case "database":
      return <DatabaseExplorer />;
    case "storage":
      return <StorageBrowser />;
    case "api":
      return (
        <div className="h-full overflow-y-auto">
          <ApiManager />
        </div>
      );
    case "auth":
      return (
        <div className="h-full overflow-y-auto">
          <AuthConfig />
        </div>
      );
    case "billing":
      return (
        <div className="h-full overflow-y-auto">
          <BillingPanel />
        </div>
      );
    case "history":
      return (
        <div className="h-full overflow-y-auto">
          <HistoryTimeline />
        </div>
      );
    default:
      return (
        <div className="flex h-full items-center justify-center text-muted-foreground/30">
          <span className="text-sm">Unknown tab: {tab}</span>
        </div>
      );
  }
}

export default ProjectWorkspace;
