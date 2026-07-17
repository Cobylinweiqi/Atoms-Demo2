"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../stores/builder-store";
import type { BuilderTask, TaskStatus } from "../types";

// ═══════════════════════════════════════════════════════════════
// TaskPanel — Task 列表面板 (侧栏)
// 展示: 所有任务 / 状态统计 / Accept All / Reject All / 文件变更概览
// ═══════════════════════════════════════════════════════════════

interface TaskPanelProps {
  className?: string;
}

export function TaskPanel({ className }: TaskPanelProps) {
  const messages = useBuilderStore((s) => s.messages);
  const tasks = useBuilderStore((s) => s.tasks);
  const [activeTab, setActiveTab] = useState<"tasks" | "changes" | "memory">("tasks");

  // 收集所有文件变更
  const allFileChanges = messages.flatMap((m) =>
    m.blocks.filter((b) => b.type === "file_change"),
  );

  const pendingChanges = allFileChanges.filter((b) => b.type === "file_change" && b.status === "pending");
  const acceptedChanges = allFileChanges.filter((b) => b.type === "file_change" && b.status === "accepted");

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      {/* ─── 头部 ─── */}
      <header className="glass-nav flex h-12 shrink-0 items-center gap-2 border-b border-border/[0.06] px-4">
        <LucideIcons.ListTodo size={14} className="text-primary" />
        <span className="text-sm font-medium text-foreground">Builder</span>

        {/* 标签计数 */}
        <div className="ml-auto flex items-center gap-1">
          <TabButton
            active={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
            count={tasks.length}
            icon={LucideIcons.ListChecks}
          />
          <TabButton
            active={activeTab === "changes"}
            onClick={() => setActiveTab("changes")}
            count={pendingChanges.length}
            icon={LucideIcons.FileDiff}
            highlight={pendingChanges.length > 0}
          />
          <TabButton
            active={activeTab === "memory"}
            onClick={() => setActiveTab("memory")}
            icon={LucideIcons.Brain}
          />
        </div>
      </header>

      {/* ─── 内容区 ─── */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "tasks" && <TasksTab tasks={tasks} />}
        {activeTab === "changes" && (
          <ChangesTab
            changes={allFileChanges.filter((b): b is Extract<typeof b, { type: "file_change" }> => b.type === "file_change")}
          />
        )}
        {activeTab === "memory" && <MemoryTab />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TabButton
// ═══════════════════════════════════════════════════════════════

function TabButton({
  active,
  onClick,
  count,
  icon: Icon,
  highlight,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  icon: LucideIcons.LucideIcon;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors",
        active
          ? "bg-foreground/8 text-foreground"
          : "text-muted-foreground/50 hover:bg-foreground/4 hover:text-foreground",
      )}
    >
      <Icon size={12} />
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "rounded-full px-1 text-[9px] font-bold",
            highlight ? "bg-warning/20 text-warning" : "bg-foreground/10 text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// TasksTab — 任务标签页
// ═══════════════════════════════════════════════════════════════

function TasksTab({ tasks }: { tasks: BuilderTask[] }) {
  if (tasks.length === 0) {
    return <EmptyState icon={LucideIcons.ListChecks} message="No tasks yet" hint="Send a prompt to start" />;
  }

  const stats = {
    completed: tasks.filter((t) => t.status === "completed").length,
    running: tasks.filter((t) => t.status === "running").length,
    failed: tasks.filter((t) => t.status === "failed").length,
    queued: tasks.filter((t) => t.status === "queued").length,
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      {/* 统计 */}
      <div className="grid grid-cols-4 gap-1.5">
        <StatCard label="Done" value={stats.completed} color="text-success" />
        <StatCard label="Running" value={stats.running} color="text-primary" />
        <StatCard label="Queued" value={stats.queued} color="text-muted-foreground" />
        <StatCard label="Failed" value={stats.failed} color="text-destructive" />
      </div>

      {/* 任务列表 */}
      <div className="flex flex-col gap-1">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ChangesTab — 文件变更标签页
// ═══════════════════════════════════════════════════════════════

function ChangesTab({
  changes,
}: {
  changes: Array<Extract<import("../types").OutputBlock, { type: "file_change" }>>;
}) {
  const messages = useBuilderStore((s) => s.messages);
  const acceptAllFileChanges = useBuilderStore((s) => s.acceptAllFileChanges);
  const rejectAllFileChanges = useBuilderStore((s) => s.rejectAllFileChanges);

  if (changes.length === 0) {
    return <EmptyState icon={LucideIcons.FileDiff} message="No file changes" hint="AI will suggest changes here" />;
  }

  const pending = changes.filter((c) => c.status === "pending");

  return (
    <div className="flex flex-col gap-2 p-3">
      {/* 批量操作 */}
      {pending.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-border/[0.06] bg-foreground/[0.02] p-2">
          <span className="text-xs text-muted-foreground">{pending.length} pending</span>
          <div className="ml-auto flex gap-1">
            <button
              onClick={() => {
                // Accept all in all messages
                messages.forEach((m) => {
                  if (m.blocks.some((b) => b.type === "file_change" && b.status === "pending")) {
                    acceptAllFileChanges(m.id);
                  }
                });
              }}
              className="rounded-lg bg-success/15 px-2.5 py-1 text-xs text-success transition-colors hover:bg-success/25"
            >
              Accept All
            </button>
            <button
              onClick={() => {
                messages.forEach((m) => {
                  if (m.blocks.some((b) => b.type === "file_change" && b.status === "pending")) {
                    rejectAllFileChanges(m.id);
                  }
                });
              }}
              className="rounded-lg bg-destructive/10 px-2.5 py-1 text-xs text-destructive transition-colors hover:bg-destructive/20"
            >
              Reject All
            </button>
          </div>
        </div>
      )}

      {/* 变更列表 */}
      <div className="flex flex-col gap-1">
        {changes.map((change) => (
          <ChangeRow key={change.id} change={change} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MemoryTab — Memory 标签页
// ═══════════════════════════════════════════════════════════════

function MemoryTab() {
  const memory = useBuilderStore((s) => s.memory);
  const removeMemory = useBuilderStore((s) => s.removeMemory);
  const togglePinMemory = useBuilderStore((s) => s.togglePinMemory);

  if (memory.length === 0) {
    return (
      <EmptyState
        icon={LucideIcons.Brain}
        message="No memories"
        hint="AI will save important context here"
      />
    );
  }

  return (
    <div className="flex flex-col gap-1.5 p-3">
      {memory.map((entry) => (
        <div
          key={entry.id}
          className="group rounded-xl border border-border/[0.06] bg-foreground/[0.02] p-2.5 transition-colors hover:border-border/10"
        >
          <div className="flex items-start gap-2">
            <button
              onClick={() => togglePinMemory(entry.id)}
              className={cn(
                "mt-0.5 transition-colors",
                entry.pinned ? "text-primary" : "text-muted-foreground/30 hover:text-foreground",
              )}
            >
              <LucideIcons.Pin size={11} className={entry.pinned ? "fill-current" : ""} />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-foreground/5 px-1 py-0.5 text-[9px] uppercase text-muted-foreground/50">
                  {entry.type}
                </span>
                <span className="text-xs font-medium text-foreground truncate">{entry.key}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground/70 line-clamp-2">{entry.value}</p>
            </div>

            <button
              onClick={() => removeMemory(entry.id)}
              className="text-muted-foreground/30 opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
            >
              <LucideIcons.Trash2 size={11} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 辅助组件
// ═══════════════════════════════════════════════════════════════

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-border/[0.06] bg-foreground/[0.02] px-2 py-1.5 text-center">
      <div className={cn("text-base font-bold", color)}>{value}</div>
      <div className="text-[9px] text-muted-foreground/50">{label}</div>
    </div>
  );
}

function TaskRow({ task }: { task: BuilderTask }) {
  const config = TASK_ROW_CONFIG[task.status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/[0.04] px-2.5 py-2 transition-colors hover:bg-foreground/[0.02]">
      <Icon size={13} className={cn(config.color, config.animate && "animate-spin")} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-foreground truncate">{task.title}</div>
        <div className="text-[10px] text-muted-foreground/40 truncate">{task.description}</div>
      </div>
      <span className={cn("text-[10px]", config.color)}>{task.status}</span>
    </div>
  );
}

function ChangeRow({
  change,
}: {
  change: Extract<import("../types").OutputBlock, { type: "file_change" }>;
}) {
  const actionIcon = {
    create: LucideIcons.FilePlus,
    modify: LucideIcons.FileEdit,
    delete: LucideIcons.FileX,
  }[change.action];
  const ActionIcon = actionIcon;

  const statusColor = {
    pending: "text-warning",
    accepted: "text-success",
    rejected: "text-destructive",
  }[change.status];

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/[0.04] px-2.5 py-2 transition-colors hover:bg-foreground/[0.02]">
      <ActionIcon size={13} className={statusColor} />
      <span className="flex-1 text-xs text-foreground truncate font-mono">{change.filename}</span>
      <span className={cn("text-[10px]", statusColor)}>{change.status}</span>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  message,
  hint,
}: {
  icon: LucideIcons.LucideIcon;
  message: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/[0.03]">
        <Icon size={20} className="text-muted-foreground/30" />
      </div>
      <div className="text-xs text-muted-foreground/60">{message}</div>
      <div className="text-[10px] text-muted-foreground/30">{hint}</div>
    </div>
  );
}

// ─── 任务状态配置 ───
const TASK_ROW_CONFIG: Record<TaskStatus, { icon: LucideIcons.LucideIcon; color: string; animate?: boolean }> = {
  queued: { icon: LucideIcons.Clock, color: "text-muted-foreground/40" },
  running: { icon: LucideIcons.Loader2, color: "text-primary", animate: true },
  completed: { icon: LucideIcons.CheckCircle2, color: "text-success" },
  failed: { icon: LucideIcons.XCircle, color: "text-destructive" },
  cancelled: { icon: LucideIcons.MinusCircle, color: "text-muted-foreground/30" },
};
