"use client";

import React, { useState, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { useWorkspaceStore } from "../stores/workspace-store";

// ═══════════════════════════════════════════════════════════════
// TerminalEmulator — 终端模拟器
// 展示: 命令行交互 / 命令历史 / 环境目录
// ═══════════════════════════════════════════════════════════════

export function TerminalEmulator() {
  const terminalSessions = useWorkspaceStore((s) => s.terminalSessions);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const executeTerminal = useWorkspaceStore((s) => s.executeTerminal);
  const environments = useWorkspaceStore((s) => s.environments);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeEnv = environments.find((e) => e.id === activeEnvId);
  const session = terminalSessions.find((t) => t.environmentId === activeEnvId);
  const cwd = session?.cwd ?? "/app";

  // 自动滚动
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [session?.output]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    executeTerminal(input);
    setHistory((h) => [input, ...h]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      // Clear screen
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0a0a0b]" onClick={() => inputRef.current?.focus()}>
      {/* ─── 标题栏 ─── */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="ml-2 text-xs font-medium text-white/60">
          Terminal — {activeEnv?.name}
        </span>
        <span className="ml-auto text-[10px] text-white/30">
          {activeEnv?.type} · {cwd}
        </span>
      </div>

      {/* ─── 终端输出 ─── */}
      <div
        ref={containerRef}
        className="flex-1 cursor-text overflow-y-auto p-3 font-mono text-[12px] leading-relaxed text-white/80"
      >
        <pre className="whitespace-pre-wrap break-all">{session?.output}</pre>
        {/* 输入行 */}
        <div className="flex items-center gap-2">
          <span className="text-[#27c93f]">nova@{activeEnv?.slug}</span>
          <span className="text-white/40">:</span>
          <span className="text-[#5db7de]">{cwd}</span>
          <span className="text-white/40">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border-none bg-transparent text-white/90 caret-[#27c93f] focus:outline-none"
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>

      {/* ─── 快捷命令 ─── */}
      <div className="flex items-center gap-1 border-t border-white/[0.06] px-3 py-1.5">
        <span className="mr-1 text-[10px] text-white/30">Quick:</span>
        {["ls", "pwd", "help", "date"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              executeTerminal(cmd);
              inputRef.current?.focus();
            }}
            className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
