"use client";

import React, { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import type { LogLevel, LogSource } from "../types";

// ═══════════════════════════════════════════════════════════════
// LogViewer — 日志查看器
// 展示: 按环境/级别/来源过滤 / 实时滚动 / 清空
// ═══════════════════════════════════════════════════════════════

const LEVEL_CONFIG: Record<LogLevel, { color: string; bg: string; label: string }> = {
  debug: { color: "text-muted-foreground/50", bg: "bg-muted-foreground/5", label: "DBG" },
  info: { color: "text-primary", bg: "bg-primary/5", label: "INF" },
  warn: { color: "text-warning", bg: "bg-warning/5", label: "WRN" },
  error: { color: "text-destructive", bg: "bg-destructive/5", label: "ERR" },
  fatal: { color: "text-destructive", bg: "bg-destructive/10", label: "FTL" },
};

const SOURCE_CONFIG: Record<LogSource, string> = {
  build: "text-blue-400",
  runtime: "text-purple-400",
  deploy: "text-green-400",
  terminal: "text-orange-400",
  system: "text-gray-400",
};

export function LogViewer() {
  const logs = useWorkspaceStore((s) => s.logs);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const clearLogs = useWorkspaceStore((s) => s.clearLogs);
  const addLog = useWorkspaceStore((s) => s.addLog);

  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LogSource | "all">("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter((l) => {
    if (l.environmentId !== activeEnvId) return false;
    if (levelFilter !== "all" && l.level !== levelFilter) return false;
    if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
    return true;
  });

  // 自动滚动到底部
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  // 模拟新日志
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        { level: "info" as LogLevel, source: "runtime" as LogSource, message: "Request processed: GET /api/health (200) 12ms" },
        { level: "info" as LogLevel, source: "runtime" as LogSource, message: "Request processed: POST /api/leads (201) 45ms" },
        { level: "warn" as LogLevel, source: "runtime" as LogSource, message: "Slow query detected (1.2s): SELECT * FROM leads" },
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      addLog({ ...msg, environmentId: activeEnvId ?? undefined });
    }, 8000);

    return () => clearInterval(interval);
  }, [activeEnvId, addLog]);

  return (
    <div className="flex h-full flex-col">
      {/* ─── 工具栏 ─── */}
      <div className="flex items-center gap-2 border-b border-border/[0.06] px-4 py-2.5">
        <span className="text-sm font-semibold text-foreground">Logs</span>
        {/* 级别过滤 */}
        <div className="ml-2 flex items-center gap-0.5">
          {(["all", "info", "warn", "error"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl as LogLevel | "all")}
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-medium uppercase transition-colors",
                levelFilter === lvl ? "bg-foreground/8 text-foreground" : "text-muted-foreground/40 hover:text-foreground",
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
        {/* 来源过滤 */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as LogSource | "all")}
          className="rounded-md bg-foreground/5 px-2 py-0.5 text-[10px] text-foreground focus:outline-none"
        >
          <option value="all">All Sources</option>
          <option value="build">Build</option>
          <option value="runtime">Runtime</option>
          <option value="deploy">Deploy</option>
          <option value="terminal">Terminal</option>
          <option value="system">System</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setAutoScroll((v) => !v)}
            className={cn("flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] transition-colors", autoScroll ? "bg-primary/10 text-primary" : "text-muted-foreground/40 hover:text-foreground")}
          >
            <LucideIcons.ArrowDownToLine size={10} />
            Auto-scroll
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive"
          >
            <LucideIcons.Trash2 size={10} />
            Clear
          </button>
        </div>
      </div>

      {/* ─── 日志列表 ─── */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-2">
        {filteredLogs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/30">
            <LucideIcons.ScrollText size={28} />
            <span className="text-xs">No logs for this environment</span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 font-mono text-[11px]">
            {filteredLogs.map((log) => {
              const config = LEVEL_CONFIG[log.level] ?? LEVEL_CONFIG.info;
              return (
                <div key={log.id} className={cn("flex items-start gap-2 rounded px-2 py-0.5 hover:bg-foreground/[0.02]", config.bg)}>
                  <span className="shrink-0 text-muted-foreground/30">{formatTime(log.timestamp)}</span>
                  <span className={cn("shrink-0 font-bold", config.color)}>{config.label}</span>
                  <span className={cn("shrink-0 uppercase", SOURCE_CONFIG[log.source] ?? "text-gray-400")}>{log.source}</span>
                  <span className="flex-1 text-foreground/70">{log.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 状态栏 ─── */}
      <div className="flex items-center justify-between border-t border-border/[0.06] px-4 py-1.5 text-[10px] text-muted-foreground/40">
        <span>{filteredLogs.length} logs</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          Streaming
        </span>
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
