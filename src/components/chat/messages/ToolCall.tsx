"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// ToolCall — AI 工具调用展示
// 支持: 运行状态 / 参数/结果 JSON 查看 / 耗时显示 / 错误展示
// ═══════════════════════════════════════════════════════════════

type ToolStatus = "pending" | "running" | "completed" | "error";

interface ToolCallProps {
  toolName: string;
  args: Record<string, unknown>;
  status: ToolStatus;
  result?: unknown;
  error?: string;
  duration?: number;
  className?: string;
}

export function ToolCall({
  toolName,
  args,
  status,
  result,
  error,
  duration,
  className,
}: ToolCallProps) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig: Record<ToolStatus, { color: string; bg: string; label: string; icon: string }> = {
    pending: { color: "text-muted-foreground", bg: "bg-foreground/[0.04]", label: "Pending", icon: "Clock" },
    running: { color: "text-warning", bg: "bg-warning/10", label: "Running", icon: "Loader" },
    completed: { color: "text-success", bg: "bg-success/10", label: "Completed", icon: "CheckCircle2" },
    error: { color: "text-destructive", bg: "bg-destructive/10", label: "Error", icon: "XCircle" },
  };

  const cfg = statusConfig[status];
  const StatusIcon =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[cfg.icon] ??
    LucideIcons.Circle;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/[0.06] bg-surface-1",
        className
      )}
    >
      {/* ─── 头部 ─── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3 py-2 transition-colors hover:bg-foreground/[0.02]"
      >
        {/* 工具图标 */}
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", cfg.bg)}>
          <ToolIcon toolName={toolName} />
        </div>

        {/* 工具名 + 参数预览 */}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground font-mono">{toolName}</span>
            <span className="text-[10px] text-muted-foreground/50">
              ({Object.keys(args).length} arg{Object.keys(args).length !== 1 ? "s" : ""})
            </span>
          </div>
          {/* 参数预览 */}
          <p className="truncate text-[10px] text-muted-foreground/60 font-mono">
            {formatArgsPreview(args)}
          </p>
        </div>

        {/* 状态徽章 */}
        <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", cfg.color, cfg.bg)}>
          <StatusIcon size={10} className={cn(status === "running" && "animate-spin")} />
          {cfg.label}
        </span>

        {/* 耗时 */}
        {duration !== undefined && status !== "pending" && status !== "running" && (
          <span className="text-[10px] text-muted-foreground/40 font-mono">
            {duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(1)}s`}
          </span>
        )}

        {/* 展开箭头 */}
        <LucideIcons.ChevronDown
          size={13}
          className={cn("text-muted-foreground/40 transition-transform", expanded && "rotate-180")}
        />
      </button>

      {/* ─── 展开内容 ─── */}
      {expanded && (
        <div className="border-t border-border/[0.04]">
          {/* 参数 */}
          <div className="px-3 py-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/40">
              Arguments
            </p>
            <pre className="overflow-x-auto rounded-lg bg-foreground/[0.02] p-2">
              <code className="font-mono text-[11px] leading-relaxed text-foreground/80">
                {JSON.stringify(args, null, 2)}
              </code>
            </pre>
          </div>

          {/* 结果 */}
          {result !== undefined && status === "completed" && (
            <div className="border-t border-border/[0.04] px-3 py-2">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-success/60">
                Result
              </p>
              <pre className="overflow-x-auto rounded-lg bg-success/[0.04] p-2">
                <code className="font-mono text-[11px] leading-relaxed text-foreground/80">
                  {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
                </code>
              </pre>
            </div>
          )}

          {/* 错误 */}
          {error && status === "error" && (
            <div className="border-t border-border/[0.04] px-3 py-2">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-destructive/60">
                Error
              </p>
              <pre className="overflow-x-auto rounded-lg bg-destructive/[0.04] p-2">
                <code className="font-mono text-[11px] leading-relaxed text-destructive/90">
                  {error}
                </code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ToolIcon — 根据工具名显示对应图标
// ═══════════════════════════════════════════════════════════════

function ToolIcon({ toolName }: { toolName: string }) {
  const name = toolName.toLowerCase();

  const toolIcons: Record<string, { icon: string; color: string }> = {
    search: { icon: "Search", color: "text-primary" },
    web: { icon: "Globe", color: "text-accent" },
    code: { icon: "Code2", color: "text-secondary" },
    file: { icon: "FileCode", color: "text-warning" },
    database: { icon: "Database", color: "text-success" },
    terminal: { icon: "Terminal", color: "text-warning" },
    browser: { icon: "Globe", color: "text-accent" },
    image: { icon: "Image", color: "text-secondary" },
    api: { icon: "Webhook", color: "text-primary" },
    calc: { icon: "Calculator", color: "text-accent" },
  };

  // 匹配工具名
  let config = { icon: "Wrench", color: "text-muted-foreground" };
  for (const [key, val] of Object.entries(toolIcons)) {
    if (name.includes(key)) {
      config = val;
      break;
    }
  }

  const Icon =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[config.icon] ??
    LucideIcons.Wrench;

  return <Icon size={13} className={config.color} />;
}

// ═══════════════════════════════════════════════════════════════
// 格式化参数预览
// ═══════════════════════════════════════════════════════════════

function formatArgsPreview(args: Record<string, unknown>): string {
  const entries = Object.entries(args);
  if (entries.length === 0) return "{}";

  // 取前2个参数做预览
  const preview = entries.slice(0, 2).map(([key, val]) => {
    const valStr = typeof val === "string" ? `"${val.length > 30 ? val.slice(0, 30) + "..." : val}"` : JSON.stringify(val);
    return `${key}: ${valStr}`;
  });

  const more = entries.length > 2 ? `, ...${entries.length - 2} more` : "";
  return `{ ${preview.join(", ")}${more} }`;
}
