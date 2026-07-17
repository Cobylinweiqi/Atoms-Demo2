"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// DiffViewer — 代码 Diff 对比组件
// 支持: 并排 / 统一 视图切换, 行级高亮
// ═══════════════════════════════════════════════════════════════

interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  language?: string;
  filename?: string;
  className?: string;
}

type DiffMode = "unified" | "split";

interface DiffLine {
  type: "added" | "removed" | "context" | "empty";
  oldLineNumber: number | null;
  newLineNumber: number | null;
  content: string;
}

export function DiffViewer({ oldContent, newContent, language, filename, className }: DiffViewerProps) {
  const [mode, setMode] = useState<DiffMode>("unified");

  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");
  const diffLines = computeDiff(oldLines, newLines);

  const stats = {
    added: diffLines.filter((l) => l.type === "added").length,
    removed: diffLines.filter((l) => l.type === "removed").length,
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/[0.06] bg-surface-1", className)}>
      {/* ─── 头部 ─── */}
      <div className="flex items-center justify-between border-b border-border/[0.04] bg-foreground/[0.01] px-3 py-1.5">
        <div className="flex items-center gap-2">
          <LucideIcons.GitCompare size={12} className="text-primary" />
          <span className="text-[11px] font-medium text-muted-foreground">
            {filename || `${language || "file"} diff`}
          </span>
          {/* 统计 */}
          <span className="flex items-center gap-2 text-[10px]">
            <span className="text-success">+{stats.added}</span>
            <span className="text-destructive">-{stats.removed}</span>
          </span>
        </div>

        {/* 视图切换 */}
        <div className="flex items-center gap-0.5 rounded-lg bg-foreground/[0.03] p-0.5">
          <button
            onClick={() => setMode("unified")}
            className={cn(
              "rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
              mode === "unified" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unified
          </button>
          <button
            onClick={() => setMode("split")}
            className={cn(
              "rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
              mode === "split" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Split
          </button>
        </div>
      </div>

      {/* ─── Diff 内容 ─── */}
      <div className="overflow-x-auto">
        {mode === "unified" ? (
          <UnifiedView lines={diffLines} />
        ) : (
          <SplitView lines={diffLines} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// UnifiedView — 统一视图
// ═══════════════════════════════════════════════════════════════

function UnifiedView({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="font-mono text-[12px] leading-[1.6]">
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            "flex",
            line.type === "added" && "bg-success/[0.06]",
            line.type === "removed" && "bg-destructive/[0.06]"
          )}
        >
          {/* 行号 */}
          <span className="w-10 shrink-0 select-none border-r border-border/[0.03] px-2 text-right text-muted-foreground/30">
            {line.oldLineNumber ?? ""}
          </span>
          <span className="w-10 shrink-0 select-none border-r border-border/[0.03] px-2 text-right text-muted-foreground/30">
            {line.newLineNumber ?? ""}
          </span>
          {/* 符号 */}
          <span
            className={cn(
              "w-5 shrink-0 select-none text-center",
              line.type === "added" && "text-success",
              line.type === "removed" && "text-destructive",
              line.type === "context" && "text-muted-foreground/30"
            )}
          >
            {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
          </span>
          {/* 内容 */}
          <span
            className={cn(
              "px-2 whitespace-pre",
              line.type === "added" && "text-success/90",
              line.type === "removed" && "text-destructive/90",
              line.type === "context" && "text-foreground/80"
            )}
          >
            {line.content || " "}
          </span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SplitView — 分屏视图
// ═══════════════════════════════════════════════════════════════

function SplitView({ lines }: { lines: DiffLine[] }) {
  const leftLines = lines.filter((l) => l.type !== "added");
  const rightLines = lines.filter((l) => l.type !== "removed");

  return (
    <div className="grid grid-cols-2 font-mono text-[12px] leading-[1.6]">
      {/* 左侧 (旧) */}
      <div className="border-r border-border/[0.04]">
        {leftLines.map((line, i) => (
          <div
            key={i}
            className={cn("flex", line.type === "removed" && "bg-destructive/[0.06]")}
          >
            <span className="w-10 shrink-0 select-none border-r border-border/[0.03] px-2 text-right text-muted-foreground/30">
              {line.oldLineNumber ?? ""}
            </span>
            <span
              className={cn(
                "px-2 whitespace-pre",
                line.type === "removed" ? "text-destructive/90" : "text-foreground/80"
              )}
            >
              {line.content || " "}
            </span>
          </div>
        ))}
      </div>
      {/* 右侧 (新) */}
      <div>
        {rightLines.map((line, i) => (
          <div
            key={i}
            className={cn("flex", line.type === "added" && "bg-success/[0.06]")}
          >
            <span className="w-10 shrink-0 select-none border-r border-border/[0.03] px-2 text-right text-muted-foreground/30">
              {line.newLineNumber ?? ""}
            </span>
            <span
              className={cn(
                "px-2 whitespace-pre",
                line.type === "added" ? "text-success/90" : "text-foreground/80"
              )}
            >
              {line.content || " "}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 简单 LCS Diff 算法
// ═══════════════════════════════════════════════════════════════

function computeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const result: DiffLine[] = [];
  const m = oldLines.length;
  const n = newLines.length;

  // LCS 表
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 回溯
  let i = m;
  let j = n;
  const tempResult: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      tempResult.push({
        type: "context",
        oldLineNumber: i,
        newLineNumber: j,
        content: oldLines[i - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tempResult.push({
        type: "added",
        oldLineNumber: null,
        newLineNumber: j,
        content: newLines[j - 1],
      });
      j--;
    } else if (i > 0) {
      tempResult.push({
        type: "removed",
        oldLineNumber: i,
        newLineNumber: null,
        content: oldLines[i - 1],
      });
      i--;
    }
  }

  tempResult.reverse();
  return tempResult;
}
