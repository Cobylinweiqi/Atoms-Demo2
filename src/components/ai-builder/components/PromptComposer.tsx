"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../stores/builder-store";

// ═══════════════════════════════════════════════════════════════
// PromptComposer — Prompt 输入框
// 支持: 多行 / 快捷键 / 上下文附件展示 / Stop / 模型选择
// ═══════════════════════════════════════════════════════════════

interface PromptComposerProps {
  className?: string;
}

export function PromptComposer({ className }: PromptComposerProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRunning = useBuilderStore((s) => s.isRunning);
  const streamState = useBuilderStore((s) => s.streamState);
  const contextItems = useBuilderStore((s) => s.contextItems);
  const sendMessage = useBuilderStore((s) => s.sendMessage);
  const stopStreaming = useBuilderStore((s) => s.stopStreaming);
  const removeContext = useBuilderStore((s) => s.removeContext);
  const config = useBuilderStore((s) => s.config);
  const updateConfig = useBuilderStore((s) => s.updateConfig);

  // ─── 自适应高度 ───
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [input]);

  // ─── 发送 ───
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isRunning) return;
    sendMessage(trimmed);
    setInput("");
  }, [input, isRunning, sendMessage]);

  // ─── 键盘快捷键 ───
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter 发送 / Shift+Enter 换行
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Cmd/Ctrl + K 清空
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setInput("");
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 border-t border-border/[0.06] p-3", className)}>
      {/* ─── 上下文附件预览 ─── */}
      {contextItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {contextItems.map((item) => (
            <ContextChip
              key={item.id}
              label={item.label}
              type={item.type}
              onRemove={() => removeContext(item.id)}
            />
          ))}
        </div>
      )}

      {/* ─── 输入区域 ─── */}
      <div className="glass relative flex items-end gap-2 rounded-2xl border border-border/[0.08] p-2 transition-all focus-within:border-primary/30 focus-within:shadow-glow">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to build..."
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          disabled={isRunning}
        />

        {/* ─── 操作按钮组 ─── */}
        <div className="flex items-center gap-1.5 pb-1">
          {/* 模型选择 */}
          <ModelSelector
            model={config.model}
            onChange={(model) => updateConfig({ model })}
          />

          {/* 分隔线 */}
          <div className="h-5 w-px bg-border/10" />

          {/* Stop / Send */}
          {isRunning ? (
            <button
              onClick={stopStreaming}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/15 text-destructive transition-all hover:bg-destructive/25"
              title="Stop"
            >
              <LucideIcons.Square size={14} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-glow transition-all hover:shadow-glow-lg disabled:opacity-30 disabled:shadow-none"
              title="Send (Enter)"
            >
              <LucideIcons.ArrowUp size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ─── 底部提示 ─── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/40">
          <span>
            <kbd className="rounded bg-foreground/5 px-1 py-0.5 font-mono">Enter</kbd> send
          </span>
          <span>
            <kbd className="rounded bg-foreground/5 px-1 py-0.5 font-mono">Shift+Enter</kbd> newline
          </span>
          <span>
            <kbd className="rounded bg-foreground/5 px-1 py-0.5 font-mono">⌘K</kbd> clear
          </span>
        </div>
        {isRunning && (
          <span className="flex items-center gap-1.5 text-[10px] text-primary/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            {streamState === "thinking" ? "Thinking..." : "Streaming..."}
          </span>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ContextChip — 上下文附件标签
// ═══════════════════════════════════════════════════════════════

function ContextChip({
  label,
  type,
  onRemove,
}: {
  label: string;
  type: string;
  onRemove: () => void;
}) {
  const icon = {
    file: LucideIcons.FileCode,
    image: LucideIcons.Image,
    selection: LucideIcons.TextCursor,
    url: LucideIcons.Link,
    memory: LucideIcons.Brain,
    conversation: LucideIcons.MessagesSquare,
    codebase: LucideIcons.FolderGit2,
  }[type] ?? LucideIcons.Paperclip;

  const Icon = icon;

  return (
    <div className="group flex items-center gap-1.5 rounded-lg border border-border/[0.08] bg-foreground/[0.03] px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-border/15">
      <Icon size={12} className="text-primary/60" />
      <span className="max-w-32 truncate">{label}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 text-muted-foreground/40 transition-colors hover:text-destructive"
      >
        <LucideIcons.X size={12} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ModelSelector — 模型选择器
// ═══════════════════════════════════════════════════════════════

const MODELS = [
  { id: "claude-sonnet-4-5", name: "Sonnet 4.5", provider: "Anthropic" },
  { id: "claude-opus-4-1", name: "Opus 4.1", provider: "Anthropic" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
];

function ModelSelector({
  model,
  onChange,
}: {
  model: string;
  onChange: (model: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <LucideIcons.Cpu size={12} />
        <span>{MODELS.find((m) => m.id === model)?.name ?? model}</span>
        <LucideIcons.ChevronDown size={10} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 z-20 mb-2 w-48 overflow-hidden rounded-xl border border-border/[0.08] glass shadow-glass">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-foreground/5",
                  m.id === model ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div>
                  <div className="font-medium text-foreground">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground/50">{m.provider}</div>
                </div>
                {m.id === model && <LucideIcons.Check size={12} className="text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
