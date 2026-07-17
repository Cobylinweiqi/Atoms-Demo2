"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// MarkdownRenderer — 轻量 Markdown 渲染器
// 支持: 标题/段落/列表/引用/链接/行内代码/粗体/斜体/表格/分隔线
// ═══════════════════════════════════════════════════════════════

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className={cn("text-sm leading-relaxed text-foreground", className)}>
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Markdown 解析器 (轻量, 不依赖外部库)
// ═══════════════════════════════════════════════════════════════

type BlockType =
  | "heading"
  | "paragraph"
  | "code"
  | "list"
  | "ordered-list"
  | "quote"
  | "hr"
  | "table";

interface MdBlock {
  type: BlockType;
  level?: number;        // heading level 1-6
  content?: string;      // text content
  items?: string[];      // list items
  language?: string;     // code language
  rows?: string[][];     // table rows
}

function parseMarkdown(text: string): MdBlock[] {
  const lines = text.split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 空行跳过
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 代码块 ```lang ... ```
    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", language: language || "text", content: codeLines.join("\n") });
      continue;
    }

    // 标题 # ## ###
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        content: headingMatch[2],
      });
      i++;
      continue;
    }

    // 分隔线 --- ***
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // 引用 >
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", content: quoteLines.join("\n") });
      continue;
    }

    // 有序列表 1. 2.
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    // 无序列表 - * +
    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // 表格 | a | b |
    if (line.includes("|") && i + 1 < lines.length && /^\|?[\s-:]+\|/.test(lines[i + 1])) {
      const rows: string[][] = [];
      // header
      rows.push(line.split("|").map((c) => c.trim()).filter(Boolean));
      i += 2; // skip header + separator
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(lines[i].split("|").map((c) => c.trim()).filter(Boolean));
        i++;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    // 普通段落 (收集连续非空行)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith(">") &&
      !/^[-*+]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", content: paraLines.join(" ") });
    }
  }

  return blocks;
}

// ═══════════════════════════════════════════════════════════════
// 行内格式解析 (粗体/斜体/行内代码/链接)
// ═══════════════════════════════════════════════════════════════

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns: { regex: RegExp; render: (match: RegExpMatchArray) => React.ReactNode }[] = [
    // 行内代码 `code`
    {
      regex: /`([^`]+)`/,
      render: (m) => (
        <code
          key={`code-${key++}`}
          className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-primary"
        >
          {m[1]}
        </code>
      ),
    },
    // 粗体 **text**
    {
      regex: /\*\*([^*]+)\*\*/,
      render: (m) => (
        <strong key={`bold-${key++}`} className="font-semibold text-foreground">
          {m[1]}
        </strong>
      ),
    },
    // 斜体 *text*
    {
      regex: /\*([^*]+)\*/,
      render: (m) => (
        <em key={`italic-${key++}`} className="italic">
          {m[1]}
        </em>
      ),
    },
    // 链接 [text](url)
    {
      regex: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (m) => (
        <a
          key={`link-${key++}`}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
        >
          {m[1]}
        </a>
      ),
    },
  ];

  while (remaining.length > 0) {
    let earliestMatch: { match: RegExpMatchArray; renderer: (m: RegExpMatchArray) => React.ReactNode; index: number } | null = null;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        if (!earliestMatch || match.index < earliestMatch.index) {
          earliestMatch = { match, renderer: pattern.render, index: match.index };
        }
      }
    }

    if (!earliestMatch) {
      nodes.push(remaining);
      break;
    }

    // 添加匹配前的文本
    if (earliestMatch.index > 0) {
      nodes.push(remaining.slice(0, earliestMatch.index));
    }

    // 添加匹配的节点
    nodes.push(earliestMatch.renderer(earliestMatch.match));

    // 继续处理剩余文本
    remaining = remaining.slice(earliestMatch.index + earliestMatch.match[0].length);
  }

  return nodes;
}

// ═══════════════════════════════════════════════════════════════
// BlockRenderer — 块渲染器
// ═══════════════════════════════════════════════════════════════

function BlockRenderer({ block }: { block: MdBlock }) {
  switch (block.type) {
    case "heading": {
      const sizes: Record<number, string> = {
        1: "text-xl font-bold mt-4 mb-2",
        2: "text-lg font-bold mt-3 mb-2",
        3: "text-base font-semibold mt-3 mb-1.5",
        4: "text-sm font-semibold mt-2 mb-1",
        5: "text-sm font-medium mt-2 mb-1",
        6: "text-xs font-medium mt-2 mb-1 text-muted-foreground",
      };
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return React.createElement(Tag, { className: sizes[block.level || 6] }, renderInline(block.content || ""));
    }

    case "paragraph":
      return <p className="mb-2 leading-relaxed">{renderInline(block.content || "")}</p>;

    case "code":
      return (
        <pre className="mb-2 overflow-x-auto rounded-xl border border-border/[0.06] bg-surface-1 p-3">
          <code className="font-mono text-[12px] leading-relaxed text-foreground/90">
            {block.content}
          </code>
        </pre>
      );

    case "list":
      return (
        <ul className="mb-2 ml-4 list-disc space-y-1">
          {block.items?.map((item, i) => (
            <li key={i} className="leading-relaxed">{renderInline(item)}</li>
          ))}
        </ul>
      );

    case "ordered-list":
      return (
        <ol className="mb-2 ml-4 list-decimal space-y-1">
          {block.items?.map((item, i) => (
            <li key={i} className="leading-relaxed">{renderInline(item)}</li>
          ))}
        </ol>
      );

    case "quote":
      return (
        <blockquote className="mb-2 border-l-2 border-primary/30 pl-3 text-muted-foreground italic">
          {renderInline(block.content || "")}
        </blockquote>
      );

    case "hr":
      return <hr className="my-3 border-border/[0.06]" />;

    case "table":
      return (
        <div className="mb-2 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/[0.08]">
                {block.rows?.[0].map((cell, i) => (
                  <th key={i} className="px-3 py-1.5 text-left font-semibold text-foreground">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows?.slice(1).map((row, i) => (
                <tr key={i} className="border-b border-border/[0.04]">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5 text-muted-foreground">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}
