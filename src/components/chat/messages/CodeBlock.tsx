"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// CodeBlockView — 代码块组件
// 支持: 语法高亮(轻量) / 复制 / 折叠 / 文件名
// ═══════════════════════════════════════════════════════════════

interface CodeBlockViewProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
}

export function CodeBlockView({ code, language, filename, className }: CodeBlockViewProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split("\n").length;
  const shouldCollapse = lineCount > 30;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/[0.06] bg-surface-1", className)}>
      {/* ─── 代码块头部 ─── */}
      <div className="flex items-center justify-between border-b border-border/[0.04] bg-foreground/[0.01] px-3 py-1.5">
        <div className="flex items-center gap-2">
          {/* 语言图标 */}
          <LanguageIcon language={language} />
          <span className="text-[11px] font-medium text-muted-foreground">
            {filename || language}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* 行数 */}
          <span className="text-[10px] text-muted-foreground/50 mr-1">
            {lineCount} lines
          </span>

          {/* 折叠按钮 */}
          {shouldCollapse && (
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <LucideIcons.ChevronDown size={12} /> : <LucideIcons.ChevronUp size={12} />}
            </button>
          )}

          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            title="Copy code"
          >
            {copied ? (
              <LucideIcons.Check size={12} className="text-success" />
            ) : (
              <LucideIcons.Copy size={12} />
            )}
          </button>
        </div>
      </div>

      {/* ─── 代码内容 ─── */}
      {!collapsed && (
        <div className="overflow-x-auto">
          <pre className="p-3">
            <code className="font-mono text-[12px] leading-[1.65]">
              {renderHighlightedCode(code, language)}
            </code>
          </pre>
        </div>
      )}

      {/* ─── 折叠提示 ─── */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="w-full py-2 text-center text-[11px] text-muted-foreground/50 transition-colors hover:bg-foreground/[0.02] hover:text-foreground"
        >
          Show {lineCount} lines...
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LanguageIcon — 语言图标
// ═══════════════════════════════════════════════════════════════

function LanguageIcon({ language }: { language: string }) {
  const icons: Record<string, { icon: string; color: string }> = {
    javascript: { icon: "FileCode", color: "text-warning" },
    typescript: { icon: "FileCode", color: "text-primary" },
    jsx: { icon: "FileCode", color: "text-accent" },
    tsx: { icon: "FileCode", color: "text-primary" },
    python: { icon: "FileCode", color: "text-success" },
    html: { icon: "Globe", color: "text-warning" },
    css: { icon: "Palette", color: "text-primary" },
    json: { icon: "Braces", color: "text-warning" },
    bash: { icon: "Terminal", color: "text-success" },
    shell: { icon: "Terminal", color: "text-success" },
    sql: { icon: "Database", color: "text-secondary" },
  };

  const config = icons[language.toLowerCase()] || { icon: "FileCode", color: "text-muted-foreground" };
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[config.icon] ?? LucideIcons.FileCode;

  return <Icon size={12} className={config.color} />;
}

// ═══════════════════════════════════════════════════════════════
// 轻量语法高亮 (基于关键词, 不依赖外部库)
// ═══════════════════════════════════════════════════════════════

const KEYWORDS: Record<string, string[]> = {
  javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "export", "default", "class", "extends", "new", "async", "await", "try", "catch", "throw", "typeof", "instanceof", "this", "super", "null", "undefined", "true", "false"],
  typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "export", "default", "class", "extends", "new", "async", "await", "try", "catch", "throw", "typeof", "instanceof", "this", "super", "null", "undefined", "true", "false", "interface", "type", "enum", "implements", "private", "public", "protected", "readonly", "as", "is", "namespace", "declare", "abstract"],
  jsx: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "export", "default", "class", "extends", "new", "async", "await", "try", "catch", "throw", "typeof", "instanceof", "this", "super", "null", "undefined", "true", "false"],
  tsx: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "export", "default", "class", "extends", "new", "async", "await", "try", "catch", "throw", "typeof", "instanceof", "this", "super", "null", "undefined", "true", "false", "interface", "type", "enum", "implements", "private", "public", "protected", "readonly", "as", "is"],
  python: ["def", "class", "import", "from", "as", "return", "if", "elif", "else", "for", "while", "try", "except", "finally", "with", "lambda", "yield", "pass", "break", "continue", "raise", "global", "nonlocal", "None", "True", "False", "and", "or", "not", "in", "is", "self"],
  bash: ["echo", "cd", "ls", "mkdir", "rm", "cp", "mv", "cat", "grep", "find", "sudo", "npm", "yarn", "pnpm", "node", "python", "pip", "git", "export", "source", "if", "then", "fi", "for", "do", "done", "while", "case", "esac"],
  sql: ["SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "TABLE", "INDEX", "VIEW", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "AS", "AND", "OR", "NOT", "NULL", "DEFAULT", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "CHECK"],
};

function renderHighlightedCode(code: string, language: string): React.ReactNode {
  const lang = language.toLowerCase();
  const keywords = KEYWORDS[lang] || KEYWORDS[lang.replace("tsx", "typescript")] || [];

  // 按行处理
  return code.split("\n").map((line, lineIdx) => (
    <div key={lineIdx} className="table-row">
      {/* 行号 */}
      <span className="table-cell select-none pr-3 text-right text-muted-foreground/30">
        {lineIdx + 1}
      </span>
      {/* 代码内容 */}
      <span className="table-cell">
        {highlightLine(line, keywords, lang)}
      </span>
    </div>
  ));
}

function highlightLine(line: string, keywords: string[], lang: string): React.ReactNode {
  // 字符串
  const stringRegex = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
  // 注释
  const commentRegex = lang === "python" ? /#.*$/ : /\/\/.*$|\/\*[\s\S]*?\*\//g;
  // 数字
  const numberRegex = /\b\d+(\.\d+)?\b/g;

  // 先提取需要高亮的部分, 然后处理关键词
  const segments: { text: string; type: "string" | "comment" | "number" | "code" }[] = [];

  let working = line;
  let currentIdx = 0;

  // 简化处理: 先找字符串和注释
  const highlights: { start: number; end: number; type: "string" | "comment" | "number" }[] = [];

  // 字符串
  let match: RegExpExecArray | null;
  stringRegex.lastIndex = 0;
  while ((match = stringRegex.exec(line)) !== null) {
    highlights.push({ start: match.index, end: match.index + match[0].length, type: "string" });
  }

  // 注释
  commentRegex.lastIndex = 0;
  while ((match = commentRegex.exec(line)) !== null) {
    highlights.push({ start: match.index, end: match.index + match[0].length, type: "comment" });
  }

  // 排序
  highlights.sort((a, b) => a.start - b.start);

  // 去重重叠
  const filtered: typeof highlights = [];
  let lastEnd = 0;
  for (const h of highlights) {
    if (h.start >= lastEnd) {
      filtered.push(h);
      lastEnd = h.end;
    }
  }

  // 构建节点
  const nodes: React.ReactNode[] = [];
  let pos = 0;
  for (const h of filtered) {
    if (h.start > pos) {
      nodes.push(highlightKeywords(line.slice(pos, h.start), keywords, nodes.length));
    }
    const text = line.slice(h.start, h.end);
    const colorClass =
      h.type === "string" ? "text-success" :
      h.type === "comment" ? "text-muted-foreground/50 italic" :
      "text-warning";
    nodes.push(
      <span key={`hl-${nodes.length}`} className={colorClass}>
        {text}
      </span>
    );
    pos = h.end;
  }
  if (pos < line.length) {
    nodes.push(highlightKeywords(line.slice(pos), keywords, nodes.length));
  }

  return nodes.length > 0 ? nodes : line;
}

function highlightKeywords(text: string, keywords: string[], keyOffset: number): React.ReactNode {
  if (keywords.length === 0) return text;

  const pattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = keyOffset;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={`kw-${key++}`} className="font-medium text-primary">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
