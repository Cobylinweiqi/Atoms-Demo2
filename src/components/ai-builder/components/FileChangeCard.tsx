"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../stores/builder-store";
import type { FileChangeBlock } from "../types";
import { getFileDiffProcessor, type DiffHunk } from "../output/file-diff";

// ═══════════════════════════════════════════════════════════════
// FileChangeCard — 文件变更卡片
// 支持: Diff 视图 / Accept / Reject / 折叠/展开 / 操作图标
// ═══════════════════════════════════════════════════════════════

interface FileChangeCardProps {
  block: FileChangeBlock;
  messageId: string;
}

export function FileChangeCard({ block, messageId }: FileChangeCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<"diff" | "new">("diff");

  const acceptFileChange = useBuilderStore((s) => s.acceptFileChange);
  const rejectFileChange = useBuilderStore((s) => s.rejectFileChange);

  // 解析 diff
  const processor = getFileDiffProcessor();
  const hunks: DiffHunk[] = block.diff
    ? processor.parseUnifiedDiff(block.diff)
    : [];
  const stats = processor.getStats(hunks);

  // 动作图标
  const actionIcon = {
    create: LucideIcons.FilePlus,
    modify: LucideIcons.FileEdit,
    delete: LucideIcons.FileX,
  }[block.action];
  const ActionIcon = actionIcon;

  // 动作颜色
  const actionColor = {
    create: "text-success",
    modify: "text-warning",
    delete: "text-destructive",
  }[block.action];

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border/[0.08] bg-foreground/[0.02]">
      {/* ─── 头部 ─── */}
      <div className="flex items-center gap-2 border-b border-border/[0.06] px-3 py-2">
        {/* 展开按钮 */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <LucideIcons.ChevronDown
            size={14}
            className={cn("transition-transform", !expanded && "-rotate-90")}
          />
        </button>

        {/* 文件图标 */}
        <ActionIcon size={14} className={actionColor} />

        {/* 文件名 */}
        <span className="text-xs font-medium text-foreground">{block.filename}</span>

        {/* 语言标签 */}
        <span className="rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground/50">
          {block.language}
        </span>

        {/* 统计 */}
        {stats.changes > 0 && (
          <span className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="text-success">+{stats.additions}</span>
            <span className="text-destructive">-{stats.deletions}</span>
          </span>
        )}

        {/* 状态徽章 */}
        <StatusBadge status={block.status} />

        {/* 视图切换 */}
        {block.status === "pending" && expanded && (
          <div className="ml-auto flex items-center gap-0.5 rounded-lg bg-foreground/5 p-0.5">
            <button
              onClick={() => setViewMode("diff")}
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] transition-colors",
                viewMode === "diff"
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground/50 hover:text-foreground",
              )}
            >
              Diff
            </button>
            <button
              onClick={() => setViewMode("new")}
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] transition-colors",
                viewMode === "new"
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground/50 hover:text-foreground",
              )}
            >
              Full
            </button>
          </div>
        )}
      </div>

      {/* ─── 变更原因 ─── */}
      {block.reason && expanded && (
        <div className="flex items-start gap-2 border-b border-border/[0.04] bg-foreground/[0.01] px-3 py-2">
          <LucideIcons.Info size={12} className="mt-0.5 shrink-0 text-primary/60" />
          <p className="text-xs text-muted-foreground">{block.reason}</p>
        </div>
      )}

      {/* ─── Diff 内容 ─── */}
      {expanded && (
        <div className="overflow-x-auto">
          {viewMode === "diff" ? (
            <DiffView hunks={hunks} oldContent={block.oldContent} newContent={block.newContent} />
          ) : (
            <FullView content={block.newContent} language={block.language} />
          )}
        </div>
      )}

      {/* ─── 操作按钮 (Accept / Reject) ─── */}
      {block.status === "pending" && (
        <div className="flex items-center gap-2 border-t border-border/[0.06] px-3 py-2">
          <button
            onClick={() => acceptFileChange(messageId, block.id)}
            className="flex items-center gap-1.5 rounded-lg bg-success/15 px-3 py-1.5 text-xs font-medium text-success transition-all hover:bg-success/25"
          >
            <LucideIcons.Check size={13} />
            Accept
          </button>
          <button
            onClick={() => rejectFileChange(messageId, block.id)}
            className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-all hover:bg-destructive/20"
          >
            <LucideIcons.X size={13} />
            Reject
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(block.newContent);
            }}
            className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <LucideIcons.Copy size={12} />
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DiffView — Diff 视图
// ═══════════════════════════════════════════════════════════════

function DiffView({
  hunks,
  oldContent,
  newContent,
}: {
  hunks: DiffHunk[];
  oldContent: string;
  newContent: string;
}) {
  // 如果没有 diff (新建文件), 展示 newContent
  if (hunks.length === 0) {
    if (newContent) {
      const lines = newContent.split("\n");
      return (
        <pre className="p-3 text-xs leading-relaxed">
          <code className="font-mono">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-8 shrink-0 select-none text-right pr-2 text-success/60">
                  +
                </span>
                <span className="text-success/90">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      );
    }
    return (
      <div className="px-3 py-4 text-center text-xs text-muted-foreground/40">
        Empty file
      </div>
    );
  }

  return (
    <pre className="p-3 text-xs leading-relaxed">
      <code className="font-mono">
        {hunks.map((hunk, hi) => (
          <div key={hi}>
            {hunk.lines.map((line, li) => {
              if (line.type === "hunk_header") {
                return (
                  <div key={li} className="select-none px-1 py-0.5 text-primary/40">
                    {line.content}
                  </div>
                );
              }
              if (line.type === "context") {
                return (
                  <div key={li} className="flex">
                    <span className="w-8 shrink-0 select-none text-right pr-2 text-muted-foreground/30">
                      {line.oldLineNumber ?? ""}
                    </span>
                    <span className="w-8 shrink-0 select-none text-right pr-2 text-muted-foreground/30">
                      {line.newLineNumber ?? ""}
                    </span>
                    <span className="text-muted-foreground/70">{line.content || " "}</span>
                  </div>
                );
              }
              if (line.type === "add") {
                return (
                  <div key={li} className="flex bg-success/5">
                    <span className="w-8 shrink-0 select-none text-right pr-2 text-success/40">
                      {" "}
                    </span>
                    <span className="w-8 shrink-0 select-none text-right pr-2 text-success/60">
                      {line.newLineNumber ?? ""}
                    </span>
                    <span className="text-success/90">{line.content || " "}</span>
                  </div>
                );
              }
              if (line.type === "delete") {
                return (
                  <div key={li} className="flex bg-destructive/5">
                    <span className="w-8 shrink-0 select-none text-right pr-2 text-destructive/60">
                      {line.oldLineNumber ?? ""}
                    </span>
                    <span className="w-8 shrink-0 select-none text-right pr-2 text-destructive/40">
                      {" "}
                    </span>
                    <span className="text-destructive/80 line-through">{line.content || " "}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </code>
    </pre>
  );
}

// ═══════════════════════════════════════════════════════════════
// FullView — 完整文件视图
// ═══════════════════════════════════════════════════════════════

function FullView({ content, language }: { content: string; language: string }) {
  const lines = content.split("\n");
  return (
    <pre className="p-3 text-xs leading-relaxed">
      <code className="font-mono">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="w-8 shrink-0 select-none text-right pr-2 text-muted-foreground/30">
              {i + 1}
            </span>
            <span className="text-foreground/80">{line || " "}</span>
          </div>
        ))}
      </code>
      <div className="mt-1 select-none text-[10px] text-muted-foreground/30">
        {lines.length} lines · {language}
      </div>
    </pre>
  );
}

// ═══════════════════════════════════════════════════════════════
// StatusBadge — 状态徽章
// ═══════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: FileChangeBlock["status"] }) {
  const config = {
    pending: { label: "Pending", className: "bg-warning/10 text-warning", icon: LucideIcons.Clock },
    accepted: { label: "Accepted", className: "bg-success/10 text-success", icon: LucideIcons.Check },
    rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive", icon: LucideIcons.X },
  }[status];

  const Icon = config.icon;

  return (
    <span className={cn("flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium", config.className)}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}
