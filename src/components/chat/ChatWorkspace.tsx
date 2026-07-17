"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// ChatWorkspace — AI Chat Workspace 主容器
// 三栏布局: Project List | Chat | Preview
// ═══════════════════════════════════════════════════════════════

interface ChatWorkspaceProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatWorkspace({ children, className }: ChatWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-background",
        className
      )}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ChatPanel — 列容器 (左侧 / 中间 / 右侧)
// ═══════════════════════════════════════════════════════════════

interface ChatColumnProps {
  children: React.ReactNode;
  className?: string;
  /** 固定宽度，不设置则 flex-1 */
  width?: number;
  /** 是否显示右分隔线 (默认 true) */
  divider?: boolean;
}

export function ChatColumn({
  children,
  className,
  width,
  divider = true,
}: ChatColumnProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col",
        width ? "shrink-0" : "flex-1 min-w-0",
        divider && "border-r border-border/[0.06]",
        className
      )}
      style={width ? { width: `${width}px` } : undefined}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ChatColumnHeader — 列头部
// ═══════════════════════════════════════════════════════════════

interface ChatColumnHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatColumnHeader({ children, className }: ChatColumnHeaderProps) {
  return (
    <header
      className={cn(
        "glass-nav flex h-12 shrink-0 items-center gap-2 border-b border-border/[0.06] px-4",
        className
      )}
    >
      {children}
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════
// ChatColumnContent — 列内容区域 (可滚动)
// ═══════════════════════════════════════════════════════════════

interface ChatColumnContentProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export function ChatColumnContent({
  children,
  className,
  scrollable = true,
}: ChatColumnContentProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-hidden",
        scrollable && "overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
