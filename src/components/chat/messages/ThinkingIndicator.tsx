"use client";

import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// ThinkingIndicator — AI 思考过程展示
// 支持: 折叠/展开 / 流式动画 / 耗时显示
// ═══════════════════════════════════════════════════════════════

interface ThinkingIndicatorProps {
  content: string;
  duration?: number;      // 思考耗时 (ms)
  collapsed?: boolean;    // 初始是否折叠
  isStreaming?: boolean;  // 是否正在流式输出思考内容
  className?: string;
}

export function ThinkingIndicator({
  content,
  duration,
  collapsed: initialCollapsed = false,
  isStreaming = false,
  className,
}: ThinkingIndicatorProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [displayDuration, setDisplayDuration] = useState(duration);

  // ─── 流式时实时计时 ───
  useEffect(() => {
    if (isStreaming && !duration) {
      const start = Date.now();
      const timer = setInterval(() => {
        setDisplayDuration(Date.now() - start);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isStreaming, duration]);

  const dur = displayDuration ?? duration;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/[0.06]", className)}>
      {/* ─── 头部 (可点击折叠) ─── */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center gap-2 bg-foreground/[0.02] px-3 py-2 transition-colors hover:bg-foreground/[0.03]"
      >
        {/* 思考图标 */}
        <div className="relative">
          <LucideIcons.Brain
            size={14}
            className={cn("text-primary", isStreaming && "animate-pulse")}
          />
          {isStreaming && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
        </div>

        <span className="text-xs font-medium text-muted-foreground">
          {isStreaming ? "Thinking..." : "Thought process"}
        </span>

        {/* 耗时 */}
        {dur !== undefined && dur > 0 && (
          <span className="text-[10px] text-muted-foreground/50 font-mono">
            {formatDuration(dur)}
          </span>
        )}

        {/* 流式点动画 */}
        {isStreaming && (
          <div className="flex items-center gap-0.5 ml-1">
            <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {/* 展开图标 */}
        <LucideIcons.ChevronDown
          size={13}
          className={cn(
            "ml-auto text-muted-foreground/50 transition-transform",
            collapsed ? "" : "rotate-180"
          )}
        />
      </button>

      {/* ─── 思考内容 ─── */}
      {!collapsed && (
        <div className="border-t border-border/[0.04] px-3 py-2.5">
          <div className="relative pl-3">
            {/* 左侧竖线 */}
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary/30 via-primary/15 to-transparent" />

            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {content}
              {isStreaming && (
                <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-primary/60 align-middle" />
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 格式化耗时 ───
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}m ${sec}s`;
}
