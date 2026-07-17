"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/components/chat/types";

// ═══════════════════════════════════════════════════════════════
// ProjectList — 左侧项目列表
// ═══════════════════════════════════════════════════════════════

interface ProjectListProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNewProject?: () => void;
  className?: string;
}

export function ProjectList({
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  className,
}: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("flex h-full flex-col bg-surface-1", className)}>
      {/* ─── Header ─── */}
      <div className="glass-nav flex h-12 shrink-0 items-center justify-between border-b border-border/[0.06] px-4">
        <div className="flex items-center gap-2">
          <LucideIcons.FolderKanban size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Projects</span>
        </div>
        <button
          onClick={onNewProject}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground/[0.04] text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground"
          title="New Project"
        >
          <LucideIcons.Plus size={14} />
        </button>
      </div>

      {/* ─── Search ─── */}
      <div className="shrink-0 px-3 py-2.5">
        <div className="relative">
          <LucideIcons.Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="h-8 w-full rounded-lg bg-foreground/[0.03] border border-border/[0.06] pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
      </div>

      {/* ─── Project List ─── */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LucideIcons.FolderOpen size={24} className="mb-2 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground/60">
              {searchQuery ? "No projects found" : "No projects yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredProjects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                isActive={project.id === activeProjectId}
                onClick={() => onSelectProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ProjectItem — 单个项目卡片
// ═══════════════════════════════════════════════════════════════

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}

function ProjectItem({ project, isActive, onClick }: ProjectItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full rounded-lg px-3 py-2.5 text-left transition-all",
        isActive
          ? "bg-primary/12 border border-primary/20"
          : "border border-transparent hover:bg-foreground/[0.03] hover:border-border/[0.06]"
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* 缩略图 */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            isActive
              ? "bg-gradient-brand-soft"
              : "bg-foreground/[0.04]"
          )}
        >
          <LucideIcons.AppWindow
            size={15}
            className={isActive ? "text-primary" : "text-muted-foreground"}
          />
        </div>

        {/* 信息 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "truncate text-xs font-medium",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {project.name}
            </span>
            {project.status === "active" && (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
            )}
          </div>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground/60">
            {project.description}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground/50">
            <span className="font-mono">{project.framework}</span>
            <span>·</span>
            <span>{project.conversationCount} chats</span>
            <span>·</span>
            <span>{formatRelativeTime(project.lastActiveAt)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── 格式化相对时间 ───
function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
