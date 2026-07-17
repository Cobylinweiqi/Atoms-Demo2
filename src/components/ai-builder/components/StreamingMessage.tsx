"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../stores/builder-store";
import type { BuilderMessage, OutputBlock, StreamState } from "../types";
import { FileChangeCard } from "./FileChangeCard";
import { ThinkingIndicator } from "@/components/chat/messages/ThinkingIndicator";
import { CodeBlockView } from "@/components/chat/messages/CodeBlock";

// ═══════════════════════════════════════════════════════════════
// StreamingMessage — 流式消息展示
// 渲染: Text / Thinking / Code / FileChange / Image / Error
// 支持: Regenerate / Continue / Retry / Stop / Copy
// ═══════════════════════════════════════════════════════════════

interface StreamingMessageProps {
  message: BuilderMessage;
  isLast: boolean;
}

export function StreamingMessage({ message, isLast }: StreamingMessageProps) {
  const isUser = message.role === "user";
  const isStreaming =
    message.streamState === "streaming" ||
    message.streamState === "connecting" ||
    message.streamState === "thinking";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* ─── 头像 ─── */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
          isUser
            ? "bg-foreground/5 text-muted-foreground"
            : "bg-gradient-brand text-white shadow-glow",
        )}
      >
        {isUser ? (
          <LucideIcons.User size={14} />
        ) : (
          <LucideIcons.Sparkles size={14} />
        )}
      </div>

      {/* ─── 消息内容 ─── */}
      <div className={cn("flex flex-1 flex-col gap-2", isUser && "items-end")}>
        {/* 消息头部 */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-medium text-foreground">
            {isUser ? "You" : "AI Builder"}
          </span>
          {message.model && !isUser && (
            <span className="text-[10px] text-muted-foreground/40">{message.model}</span>
          )}
          {isStreaming && <StreamingDots />}
        </div>

        {/* Blocks 渲染 */}
        <div className={cn("flex flex-col gap-2", isUser && "items-end")}>
          {message.blocks.length === 0 && isStreaming && (
            <div className="flex items-center gap-2 rounded-xl border border-border/[0.06] bg-foreground/[0.02] px-4 py-3">
              <LucideIcons.Loader2 size={14} className="animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Connecting...</span>
            </div>
          )}

          {message.blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              messageId={message.id}
              isStreaming={isStreaming}
            />
          ))}
        </div>

        {/* ─── 操作按钮 (仅 assistant 最后一条消息) ─── */}
        {!isUser && !isStreaming && isLast && (
          <MessageActions message={message} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BlockRenderer — 渲染单个 Block
// ═══════════════════════════════════════════════════════════════

function BlockRenderer({
  block,
  messageId,
  isStreaming,
}: {
  block: OutputBlock;
  messageId: string;
  isStreaming: boolean;
}) {
  switch (block.type) {
    case "text":
      return (
        <div className="max-w-full rounded-xl bg-foreground/[0.02] px-4 py-3">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {block.content}
            {isStreaming && (
              <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary/60 align-middle" />
            )}
          </p>
        </div>
      );

    case "thinking":
      return (
        <ThinkingIndicator
          content={block.content}
          isStreaming={isStreaming}
          collapsed={false}
        />
      );

    case "code":
      return (
        <div className="w-full max-w-2xl overflow-hidden">
          <CodeBlockView
            code={block.code}
            language={block.language}
          />
        </div>
      );

    case "file_change":
      return <FileChangeCard block={block} messageId={messageId} />;

    case "image":
      return (
        <div className="overflow-hidden rounded-xl border border-border/[0.06]">
          <img
            src={block.url}
            alt={block.alt ?? ""}
            className="max-w-md"
          />
        </div>
      );

    case "task_update":
      return (
        <div className="flex items-center gap-2 rounded-lg bg-foreground/[0.02] px-3 py-2 text-xs text-muted-foreground">
          <LucideIcons.ListTodo size={12} className="text-primary/60" />
          <span>Task: {block.message ?? block.status}</span>
        </div>
      );

    case "error":
      return (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <LucideIcons.AlertCircle size={14} className="text-destructive" />
          <span className="text-sm text-destructive">{block.message}</span>
          {block.retryable && (
            <button
              onClick={() => useBuilderStore.getState().retryMessage(messageId)}
              className="ml-auto rounded-lg px-2 py-1 text-xs text-destructive transition-colors hover:bg-destructive/10"
            >
              Retry
            </button>
          )}
        </div>
      );

    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// MessageActions — 消息操作按钮
// 支持: Regenerate / Continue / Retry / Copy
// ═══════════════════════════════════════════════════════════════

function MessageActions({ message }: { message: BuilderMessage }) {
  const [copied, setCopied] = useState(false);
  const regenerateMessage = useBuilderStore((s) => s.regenerateMessage);
  const continueMessage = useBuilderStore((s) => s.continueMessage);
  const retryMessage = useBuilderStore((s) => s.retryMessage);

  const hasError = message.blocks.some((b) => b.type === "error");
  const hasText = message.blocks.some((b) => b.type === "text");

  const handleCopy = () => {
    const text = message.blocks
      .filter((b) => b.type === "text")
      .map((b) => (b as { content: string }).content)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Copy */}
      {hasText && (
        <ActionButton onClick={handleCopy} icon={copied ? LucideIcons.Check : LucideIcons.Copy} label="Copy" />
      )}

      {/* Regenerate */}
      <ActionButton
        onClick={() => regenerateMessage(message.id)}
        icon={LucideIcons.RotateCcw}
        label="Regenerate"
      />

      {/* Continue */}
      {hasText && (
        <ActionButton
          onClick={() => continueMessage(message.id)}
          icon={LucideIcons.Forward}
          label="Continue"
        />
      )}

      {/* Retry (仅错误时) */}
      {hasError && (
        <ActionButton
          onClick={() => retryMessage(message.id)}
          icon={LucideIcons.RefreshCw}
          label="Retry"
          variant="destructive"
        />
      )}
    </div>
  );
}

// ─── ActionButton ───
function ActionButton({
  onClick,
  icon: Icon,
  label,
  variant = "default",
}: {
  onClick: () => void;
  icon: LucideIcons.LucideIcon;
  label: string;
  variant?: "default" | "destructive";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors",
        variant === "destructive"
          ? "text-destructive/60 hover:bg-destructive/10 hover:text-destructive"
          : "text-muted-foreground/50 hover:bg-foreground/5 hover:text-foreground",
      )}
      title={label}
    >
      <Icon size={11} />
      <span>{label}</span>
    </button>
  );
}

// ─── StreamingDots ───
function StreamingDots() {
  return (
    <div className="flex items-center gap-0.5">
      <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
