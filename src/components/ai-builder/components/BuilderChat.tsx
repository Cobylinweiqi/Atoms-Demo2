"use client";

import React, { useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../stores/builder-store";
import { StreamingMessage } from "./StreamingMessage";
import { PromptComposer } from "./PromptComposer";
import { AgentProgress } from "./AgentProgress";
import { BuildContextBar } from "./BuildContextBar";
import { TaskPanel } from "./TaskPanel";

// ═══════════════════════════════════════════════════════════════
// BuilderChat — AI Builder 主聊天界面
// 布局: [Context Bar] → [Agent Progress] → [Messages] → [Prompt Composer]
// ═══════════════════════════════════════════════════════════════

interface BuilderChatProps {
  className?: string;
}

export function BuilderChat({ className }: BuilderChatProps) {
  const messages = useBuilderStore((s) => s.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ─── 自动滚动到底部 ───
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 仅当用户已接近底部时才自动滚动
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 200;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      {/* ─── 上下文栏 ─── */}
      <BuildContextBar />

      {/* ─── Agent 进度 ─── */}
      <AgentProgress />

      {/* ─── 消息列表 ─── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <EmptyConversation />
          ) : (
            <div className="flex flex-col gap-6">
              {messages.map((message, index) => (
                <StreamingMessage
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ─── Prompt 输入 ─── */}
      <PromptComposer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EmptyConversation — 空对话状态
// ═══════════════════════════════════════════════════════════════

function EmptyConversation() {
  const sendMessage = useBuilderStore((s) => s.sendMessage);

  const suggestions = [
    {
      icon: LucideIcons.Layout,
      title: "Create a Component",
      prompt: "Create a responsive pricing card component with 3 tiers",
    },
    {
      icon: LucideIcons.Database,
      title: "Design a Schema",
      prompt: "Create a PostgreSQL schema for a blog with posts, comments, and tags",
    },
    {
      icon: LucideIcons.Zap,
      title: "Build an API",
      prompt: "Create a Next.js API route for user authentication with JWT",
    },
    {
      icon: LucideIcons.Palette,
      title: "Style a Page",
      prompt: "Create a CSS file for a glassmorphism login form using CSS variables",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* ─── Logo ─── */}
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-brand shadow-glow-lg">
          <LucideIcons.Sparkles size={28} className="text-white" />
        </div>
        {/* 光晕 */}
        <div className="absolute inset-0 -z-10 animate-pulse rounded-3xl bg-gradient-brand opacity-20 blur-xl" />
      </div>

      {/* ─── 标题 ─── */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">AI Builder</h2>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Describe what you want to build, and I&apos;ll generate the code
        </p>
      </div>

      {/* ─── 建议卡片 ─── */}
      <div className="grid w-full max-w-2xl grid-cols-2 gap-2">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => sendMessage(s.prompt)}
              className="group flex items-start gap-3 rounded-xl border border-border/[0.06] bg-foreground/[0.02] p-3 text-left transition-all hover:border-primary/20 hover:bg-foreground/[0.04]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft">
                <Icon size={14} className="text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground">{s.title}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground/50 line-clamp-2">
                  {s.prompt}
                </div>
              </div>
              <LucideIcons.ArrowRight
                size={12}
                className="ml-auto shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BuilderWorkspace — 完整 Builder 工作区 (聊天 + 侧栏)
// ═══════════════════════════════════════════════════════════════

interface BuilderWorkspaceProps {
  className?: string;
  showSidePanel?: boolean;
}

export function BuilderWorkspace({
  className,
  showSidePanel = true,
}: BuilderWorkspaceProps) {
  return (
    <div className={cn("flex h-full w-full overflow-hidden", className)}>
      {/* ─── 主聊天区 ─── */}
      <div className="flex-1 min-w-0">
        <BuilderChat />
      </div>

      {/* ─── 侧栏 (Task / Changes / Memory) ─── */}
      {showSidePanel && (
        <>
          <div className="w-px bg-border/[0.06]" />
          <div className="w-72 shrink-0">
            <TaskPanel />
          </div>
        </>
      )}
    </div>
  );
}
