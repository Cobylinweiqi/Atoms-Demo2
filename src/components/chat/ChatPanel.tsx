"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage, ContentBlock, AIModel } from "@/components/chat/types";
import { MarkdownRenderer } from "@/components/chat/messages/MarkdownRenderer";
import { CodeBlockView } from "@/components/chat/messages/CodeBlock";
import { DiffViewer } from "@/components/chat/messages/DiffViewer";
import { ThinkingIndicator } from "@/components/chat/messages/ThinkingIndicator";
import { ArtifactCard } from "@/components/chat/messages/ArtifactCard";
import { ImageViewer } from "@/components/chat/messages/ImageViewer";
import { FileUpload } from "@/components/chat/messages/FileUpload";
import { ToolCall } from "@/components/chat/messages/ToolCall";

// ═══════════════════════════════════════════════════════════════
// ChatPanel — 中间聊天面板
// 包含: 消息列表 + 输入框 + 模型选择
// ═══════════════════════════════════════════════════════════════

interface ChatPanelProps {
  messages: ChatMessage[];
  models: AIModel[];
  activeModel: string;
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  onStopStreaming: () => void;
  onModelChange: (modelId: string) => void;
  onRegenerate?: () => void;
  className?: string;
}

export function ChatPanel({
  messages,
  models,
  activeModel,
  isStreaming,
  onSendMessage,
  onStopStreaming,
  onModelChange,
  onRegenerate,
  className,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ─── 自动滚动到底部 ───
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ─── textarea 自适应高度 ───
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // ─── 发送消息 ───
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSendMessage(trimmed);
    setInput("");
  }, [input, isStreaming, onSendMessage]);

  // ─── 键盘快捷键 ───
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeModelInfo = models.find((m) => m.id === activeModel);

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      {/* ─── Header ─── */}
      <div className="glass-nav flex h-12 shrink-0 items-center justify-between border-b border-border/[0.06] px-4">
        <div className="flex items-center gap-2">
          <LucideIcons.MessageSquare size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Chat</span>
        </div>

        {/* 模型选择器 */}
        <ModelSelector
          models={models}
          activeModel={activeModel}
          onChange={onModelChange}
        />
      </div>

      {/* ─── 消息列表 ─── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.map((message, idx) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={idx === messages.length - 1}
                onRegenerate={onRegenerate}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── 输入区 ─── */}
      <div className="shrink-0 border-t border-border/[0.06] bg-surface-1/50 px-4 py-3">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-2 rounded-2xl glass border border-border/[0.06] p-2 focus-within:border-primary/30 transition-colors">
            {/* 文件上传按钮 */}
            <FileUploadButton />

            {/* 输入框 */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              rows={1}
              className="flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              style={{ maxHeight: "200px" }}
            />

            {/* 发送 / 停止按钮 */}
            {isStreaming ? (
              <button
                onClick={onStopStreaming}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive transition-colors hover:bg-destructive/25"
                title="Stop"
              >
                <LucideIcons.Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-glow transition-all hover:shadow-glow-lg disabled:opacity-30 disabled:shadow-none disabled:hover:translate-y-0 hover:-translate-y-0.5"
                title="Send (Enter)"
              >
                <LucideIcons.ArrowUp size={15} />
              </button>
            )}
          </div>

          {/* 底部信息条 */}
          <div className="mt-2 flex items-center justify-between px-1">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50">
              <span className="flex items-center gap-1">
                <LucideIcons.CornerDownLeft size={10} />
                Send
              </span>
              <span className="flex items-center gap-1">
                <LucideIcons.CornerDownLeft size={10} />
                Shift+Enter
              </span>
            </div>
            {activeModelInfo && (
              <span className="text-[10px] text-muted-foreground/50">
                {activeModelInfo.provider} · {activeModelInfo.contextWindow.toLocaleString()} ctx
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ModelSelector — 模型选择器
// ═══════════════════════════════════════════════════════════════

function ModelSelector({
  models,
  activeModel,
  onChange,
}: {
  models: AIModel[];
  activeModel: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = models.find((m) => m.id === activeModel);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg bg-foreground/[0.04] px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
      >
        <LucideIcons.Cpu size={12} />
        <span className="font-medium">{active?.name ?? "Select Model"}</span>
        <LucideIcons.ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl glass shadow-xl border border-border/[0.06] py-1">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-foreground/[0.04]",
                  model.id === activeModel && "bg-primary/10"
                )}
              >
                <LucideIcons.Cpu
                  size={13}
                  className={model.id === activeModel ? "text-primary" : "text-muted-foreground"}
                />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-xs font-medium", model.id === activeModel ? "text-primary" : "text-foreground")}>
                    {model.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">{model.provider}</p>
                </div>
                {model.capabilities.includes("vision") && (
                  <LucideIcons.Eye size={11} className="text-muted-foreground/50" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EmptyState — 空状态
// ═══════════════════════════════════════════════════════════════

function EmptyState() {
  const suggestions = [
    { icon: "Layout", text: "Create a landing page" },
    { icon: "Database", text: "Build a CRUD app" },
    { icon: "Palette", text: "Design a dashboard" },
    { icon: "Bot", text: "Make an AI chatbot" },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand-soft">
        <LucideIcons.Sparkles size={24} className="text-primary" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">How can I help you build?</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Describe what you want, and I&apos;ll generate it for you.
      </p>
      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-2">
        {suggestions.map((s) => {
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[s.icon];
          return (
            <div
              key={s.text}
              className="flex items-center gap-2 rounded-xl border border-border/[0.06] bg-foreground/[0.02] px-3 py-2.5 transition-colors hover:bg-foreground/[0.04] hover:border-border/[0.10] cursor-pointer"
            >
              {Icon && <Icon size={14} className="text-primary" />}
              <span className="text-xs text-muted-foreground">{s.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MessageBubble — 消息气泡
// ═══════════════════════════════════════════════════════════════

interface MessageBubbleProps {
  message: ChatMessage;
  isLast: boolean;
  onRegenerate?: () => void;
}

function MessageBubble({ message, isLast, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("mb-6 flex gap-3", isUser && "flex-row-reverse")}>
      {/* 头像 */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-foreground/[0.06]"
            : "bg-gradient-brand"
        )}
      >
        {isUser ? (
          <LucideIcons.User size={14} className="text-foreground" />
        ) : (
          <LucideIcons.Sparkles size={14} className="text-white" />
        )}
      </div>

      {/* 消息内容 */}
      <div className={cn("min-w-0 flex-1", isUser && "flex flex-col items-end")}>
        {/* 角色标签 */}
        <div className={cn("mb-1 flex items-center gap-2", isUser && "flex-row-reverse")}>
          <span className="text-xs font-semibold text-foreground">
            {isUser ? "You" : "Assistant"}
          </span>
          {!isUser && message.model && (
            <span className="text-[10px] text-muted-foreground/50">{message.model}</span>
          )}
        </div>

        {/* 内容块 */}
        <div className={cn("space-y-2", isUser && "flex flex-col items-end")}>
          {message.content.map((block) => (
            <ContentBlockRenderer key={block.id} block={block} isUser={isUser} />
          ))}
        </div>

        {/* 底部操作 */}
        {!isUser && isLast && message.streamState === "done" && (
          <div className="mt-2 flex items-center gap-1">
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-muted-foreground/50 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            >
              <LucideIcons.RefreshCw size={11} />
              Regenerate
            </button>
            <button className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-muted-foreground/50 transition-colors hover:bg-foreground/[0.04] hover:text-foreground">
              <LucideIcons.Copy size={11} />
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ContentBlockRenderer — 内容块分发器
// ═══════════════════════════════════════════════════════════════

function ContentBlockRenderer({ block, isUser }: { block: ContentBlock; isUser: boolean }) {
  switch (block.type) {
    case "text":
      return (
        <div className={cn(isUser ? "rounded-2xl rounded-tr-md bg-primary/15 px-4 py-2.5" : "")}>
          <MarkdownRenderer content={block.content} />
        </div>
      );

    case "code":
      return <CodeBlockView code={block.code} language={block.language} filename={block.filename} />;

    case "diff":
      return <DiffViewer oldContent={block.oldContent} newContent={block.newContent} language={block.language} filename={block.filename} />;

    case "thinking":
      return <ThinkingIndicator content={block.content} duration={block.duration} collapsed={block.collapsed} />;

    case "artifact":
      return <ArtifactCard title={block.title} typeKind={block.type_kind} language={block.language} content={block.content} filename={block.filename} />;

    case "image":
      return <ImageViewer url={block.url} alt={block.alt} />;

    case "file":
      return <FileUpload filename={block.filename} mimeType={block.mimeType} size={block.size} url={block.url} />;

    case "tool_call":
      return <ToolCall toolName={block.toolName} args={block.args} status={block.status} result={block.result} error={block.error} duration={block.duration} />;

    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// FileUploadButton — 文件上传按钮
// ═══════════════════════════════════════════════════════════════

function FileUploadButton() {
  return (
    <button
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
      title="Upload file"
    >
      <LucideIcons.Paperclip size={15} />
    </button>
  );
}
