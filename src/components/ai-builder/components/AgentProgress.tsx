"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../stores/builder-store";
import type { AgentStep, BuilderTask, TaskStatus } from "../types";

// ═══════════════════════════════════════════════════════════════
// AgentProgress — Agent 执行进度
// 展示: 任务列表 / 步骤状态 / 进度条 / 实时更新
// ═══════════════════════════════════════════════════════════════

interface AgentProgressProps {
  className?: string;
}

export function AgentProgress({ className }: AgentProgressProps) {
  const tasks = useBuilderStore((s) => s.tasks);
  const isRunning = useBuilderStore((s) => s.isRunning);
  const clearTasks = useBuilderStore((s) => s.clearTasks);

  if (tasks.length === 0) return null;

  const completed = tasks.filter((t) => t.status === "completed").length;
  const failed = tasks.filter((t) => t.status === "failed").length;
  const total = tasks.length;
  const progress = total > 0 ? ((completed + failed) / total) * 100 : 0;

  return (
    <div className={cn("border-b border-border/[0.06]", className)}>
      {/* ─── 进度头部 ─── */}
      <div className="flex items-center gap-2 px-4 py-2">
        <LucideIcons.Bot size={14} className="text-primary" />
        <span className="text-xs font-medium text-foreground">Agent</span>
        <span className="text-[10px] text-muted-foreground/50">
          {completed + failed} / {total}
        </span>

        {/* 进度条 */}
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/5">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
              failed > 0 ? "bg-gradient-to-r from-primary to-destructive" : "bg-gradient-brand",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 清除按钮 */}
        {!isRunning && (
          <button
            onClick={clearTasks}
            className="text-muted-foreground/40 transition-colors hover:text-foreground"
          >
            <LucideIcons.X size={12} />
          </button>
        )}
      </div>

      {/* ─── 任务列表 ─── */}
      <div className="flex flex-col gap-0.5 px-4 pb-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TaskItem — 单个任务项
// ═══════════════════════════════════════════════════════════════

function TaskItem({ task }: { task: BuilderTask }) {
  const [expanded, setExpanded] = useState(false);

  const icon = TASK_STATUS_ICON[task.status];
  const Icon = icon.icon;
  const color = icon.color;
  const animate = icon.animate;

  return (
    <div className="rounded-lg transition-colors hover:bg-foreground/[0.02]">
      {/* ─── 任务行 ─── */}
      <button
        onClick={() => task.steps && task.steps.length > 0 && setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left"
      >
        <Icon
          size={13}
          className={cn(color, animate && "animate-spin")}
        />

        <span className={cn(
          "text-xs",
          task.status === "completed" ? "text-muted-foreground" : "text-foreground",
        )}>
          {task.title}
        </span>

        {/* 耗时 */}
        {task.startedAt && task.completedAt && (
          <span className="text-[10px] text-muted-foreground/30 font-mono">
            {formatDuration(task.completedAt - task.startedAt)}
          </span>
        )}

        {/* 展开箭头 */}
        {task.steps && task.steps.length > 0 && (
          <LucideIcons.ChevronDown
            size={11}
            className={cn(
              "ml-auto text-muted-foreground/30 transition-transform",
              expanded && "rotate-180",
            )}
          />
        )}
      </button>

      {/* ─── 步骤列表 (展开时) ─── */}
      {expanded && task.steps && task.steps.length > 0 && (
        <div className="ml-7 flex flex-col gap-0.5 pb-1">
          {task.steps.map((step) => (
            <StepItem key={step.id} step={step} />
          ))}
        </div>
      )}

      {/* ─── 错误信息 ─── */}
      {task.error && (
        <div className="ml-7 flex items-start gap-1.5 px-2 pb-1 text-[10px] text-destructive">
          <LucideIcons.AlertCircle size={10} className="mt-0.5 shrink-0" />
          <span>{task.error}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// StepItem — 单个步骤
// ═══════════════════════════════════════════════════════════════

function StepItem({ step }: { step: AgentStep }) {
  const icon = STEP_STATUS_ICON[step.status];
  const Icon = icon.icon;
  const color = icon.color;
  const animate = icon.animate;

  return (
    <div className="flex items-center gap-2 px-2 py-0.5">
      <Icon size={10} className={cn(color, animate && "animate-pulse")} />
      <span className="text-[11px] text-muted-foreground/70">{step.title}</span>

      {step.toolName && (
        <span className="rounded bg-foreground/5 px-1 py-0.5 text-[9px] font-mono text-muted-foreground/50">
          {step.toolName}
        </span>
      )}

      {step.startedAt && step.completedAt && (
        <span className="text-[9px] text-muted-foreground/30 font-mono">
          {formatDuration(step.completedAt - step.startedAt)}
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 状态图标映射
// ═══════════════════════════════════════════════════════════════

const TASK_STATUS_ICON: Record<TaskStatus, { icon: LucideIcons.LucideIcon; color: string; animate?: boolean }> = {
  queued: { icon: LucideIcons.Circle, color: "text-muted-foreground/30" },
  running: { icon: LucideIcons.Loader2, color: "text-primary", animate: true },
  completed: { icon: LucideIcons.CheckCircle2, color: "text-success" },
  failed: { icon: LucideIcons.XCircle, color: "text-destructive" },
  cancelled: { icon: LucideIcons.MinusCircle, color: "text-muted-foreground/40" },
};

const STEP_STATUS_ICON: Record<string, { icon: LucideIcons.LucideIcon; color: string; animate?: boolean }> = {
  pending: { icon: LucideIcons.Circle, color: "text-muted-foreground/20" },
  thinking: { icon: LucideIcons.Brain, color: "text-primary/60", animate: true },
  executing: { icon: LucideIcons.Loader2, color: "text-primary", animate: true },
  completed: { icon: LucideIcons.Check, color: "text-success" },
  failed: { icon: LucideIcons.X, color: "text-destructive" },
  skipped: { icon: LucideIcons.Minus, color: "text-muted-foreground/30" },
};

// ─── 格式化耗时 ───
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}m${sec}s`;
}
