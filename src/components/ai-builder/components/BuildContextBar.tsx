"use client";

import React, { useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../stores/builder-store";

// ═══════════════════════════════════════════════════════════════
// BuildContextBar — 上下文栏
// 功能: 添加文件 / 添加图片 / 添加代码片段 / 清空上下文
// 展示: 当前上下文数量 / Token 估算
// ═══════════════════════════════════════════════════════════════

interface BuildContextBarProps {
  className?: string;
}

export function BuildContextBar({ className }: BuildContextBarProps) {
  const contextItems = useBuilderStore((s) => s.contextItems);
  const addContext = useBuilderStore((s) => s.addContext);
  const clearContext = useBuilderStore((s) => s.clearContext);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Token 估算
  const totalTokens = contextItems.reduce(
    (sum, item) => sum + Math.ceil(item.content.length / 4),
    0,
  );

  return (
    <div className={cn("flex items-center gap-2 border-b border-border/[0.06] px-3 py-2", className)}>
      {/* ─── 上下文计数 ─── */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
        <LucideIcons.Paperclip size={12} />
        <span>{contextItems.length} context</span>
        {totalTokens > 0 && (
          <span className="text-[10px] text-muted-foreground/30 font-mono">
            ~{totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}k` : totalTokens} tokens
          </span>
        )}
      </div>

      {/* ─── 添加上下文按钮 ─── */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu((v) => !v)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <LucideIcons.Plus size={12} />
          <span>Add</span>
        </button>

        {showAddMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)} />
            <div className="absolute left-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-border/[0.08] glass shadow-glass">
              <AddMenuItem icon={LucideIcons.FileCode} label="Add File" onClick={() => {
                triggerFileInput("text", addContext);
                setShowAddMenu(false);
              }} />
              <AddMenuItem icon={LucideIcons.Image} label="Add Image" onClick={() => {
                triggerFileInput("image", addContext);
                setShowAddMenu(false);
              }} />
              <AddMenuItem icon={LucideIcons.Code} label="Add Code Snippet" onClick={() => {
                const code = prompt("Paste code:");
                if (code) {
                  addContext({
                    type: "selection",
                    label: "code-snippet",
                    content: code,
                    meta: { language: "typescript" },
                  });
                }
                setShowAddMenu(false);
              }} />
              <AddMenuItem icon={LucideIcons.Link} label="Add URL" onClick={() => {
                const url = prompt("Enter URL:");
                if (url) {
                  addContext({
                    type: "url",
                    label: url,
                    content: url,
                  });
                }
                setShowAddMenu(false);
              }} />
            </div>
          </>
        )}
      </div>

      {/* ─── 清空按钮 ─── */}
      {contextItems.length > 0 && (
        <button
          onClick={clearContext}
          className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LucideIcons.Trash2 size={11} />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AddMenuItem
// ═══════════════════════════════════════════════════════════════

function AddMenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcons.LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      <Icon size={13} className="text-primary/60" />
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// 文件输入触发 (辅助函数)
// ═══════════════════════════════════════════════════════════════

function triggerFileInput(
  type: "text" | "image",
  addContext: (item: {
    type: "file" | "image" | "selection" | "url" | "memory" | "conversation" | "codebase";
    label: string;
    content: string;
    meta?: Record<string, unknown>;
  }) => void,
) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = type === "image" ? "image/*" : ".ts,.tsx,.js,.jsx,.css,.html,.sql,.md,.json,.txt";

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (type === "image") {
      const reader = new FileReader();
      reader.onload = () => {
        addContext({
          type: "image",
          label: file.name,
          content: reader.result as string,
          meta: { filename: file.name, mimeType: file.type, size: file.size },
        });
      };
      reader.readAsDataURL(file);
    } else {
      const text = await file.text();
      addContext({
        type: "file",
        label: file.name,
        content: text,
        meta: { filename: file.name, size: file.size },
      });
    }
  };

  input.click();
}
