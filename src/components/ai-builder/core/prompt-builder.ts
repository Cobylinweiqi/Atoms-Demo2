// ═══════════════════════════════════════════════════════════════
// Prompt Builder — Prompt 构建与模板系统
// 职责: 组装 System Prompt / 注入 Context / 注入 Memory / 变量替换
// ═══════════════════════════════════════════════════════════════

import type {
  AgentConfig,
  ContextItem,
  MemoryEntry,
  OutputLanguage,
  PromptTemplate,
  PromptVariable,
} from "../types";

// ─── 语言 → 系统指令映射 ───
const LANGUAGE_INSTRUCTIONS: Record<OutputLanguage, string> = {
  react:
    "Output production-ready React component code (TSX). Use hooks, TypeScript types, and Tailwind CSS. Do NOT include import statements unless explicitly asked.",
  html: "Output semantic HTML5 markup. Use modern tags. Inline styles should reference CSS variables where applicable.",
  css: "Output CSS code. Use CSS custom properties (variables) defined in the theme system. Avoid hard-coded color values.",
  sql: "Output SQL queries. Prefer PostgreSQL syntax. Include proper indexes and constraints in schema definitions.",
  markdown: "Output Markdown. Use proper heading hierarchy, code fences with language tags, and tables where appropriate.",
  typescript: "Output TypeScript code. Use strict typing, interfaces over types where possible.",
  javascript: "Output JavaScript code. Use modern ES6+ syntax (const/let, arrow functions, destructuring).",
  json: "Output valid JSON. Pretty-print with 2-space indentation.",
};

// ─── 默认 System Prompt ───
const BASE_SYSTEM_PROMPT = `You are Nova Studio's AI Builder — an expert full-stack engineer.

## Core Principles
1. **Think before acting**: Always reason about the approach before writing code.
2. **Minimal diffs**: Prefer modifying existing code over rewriting entire files.
3. **Type safety**: All generated code must be type-safe.
4. **Design system compliance**: Use CSS variables and theme tokens. NEVER hard-code colors.
5. **Explain changes**: Briefly explain WHY you made each change.

## Output Format
- Use \`file_change\` blocks for any file modifications (with old/new content + diff).
- Use \`code\` blocks for standalone code snippets that are NOT file edits.
- Use \`thinking\` blocks for your reasoning process.
- Use \`text\` blocks for explanations to the user.

## File Change Protocol
When modifying files:
1. State the filename and action (create/modify/delete).
2. Provide the full new content.
3. Include a unified diff showing what changed.
4. Briefly explain the rationale.`;

// ═══════════════════════════════════════════════════════════════
// PromptBuilder
// ═══════════════════════════════════════════════════════════════

export class PromptBuilder {
  private config: AgentConfig;
  private contextItems: ContextItem[];
  private memory: MemoryEntry[];
  private language: OutputLanguage;

  constructor(options: {
    config: AgentConfig;
    contextItems?: ContextItem[];
    memory?: MemoryEntry[];
    language?: OutputLanguage;
  }) {
    this.config = options.config;
    this.contextItems = options.contextItems ?? [];
    this.memory = options.memory ?? [];
    this.language = options.language ?? "react";
  }

  // ─── 构建完整 System Prompt ───
  buildSystemPrompt(): string {
    const parts: string[] = [];

    // 1. Base prompt (用户自定义 or 默认)
    parts.push(this.config.systemPrompt || BASE_SYSTEM_PROMPT);

    // 2. 语言特定指令
    parts.push(`\n## Output Language\n${LANGUAGE_INSTRUCTIONS[this.language]}`);

    // 3. Memory 注入
    if (this.config.enableMemory && this.memory.length > 0) {
      parts.push(this.buildMemorySection());
    }

    // 4. Context 注入
    if (this.contextItems.length > 0) {
      parts.push(this.buildContextSection());
    }

    // 5. Agent 约束
    parts.push(this.buildConstraintSection());

    return parts.join("\n\n---\n\n");
  }

  // ─── 构建 Memory 段 ───
  private buildMemorySection(): string {
    const lines = this.memory.map((m) => {
      const tag = `[${m.type.toUpperCase()}]`;
      const pin = m.pinned ? "📌 " : "";
      return `- ${pin}${tag} ${m.key}: ${m.value}`;
    });
    return `## Memory (Long-term context)\nThe following are persisted memories about this project and user preferences:\n${lines.join("\n")}`;
  }

  // ─── 构建 Context 段 ───
  private buildContextSection(): string {
    const sections = this.contextItems.map((item) => {
      const meta = item.meta;
      const header = meta?.filename
        ? `### ${item.label} (${meta.filename})`
        : `### ${item.label}`;

      const rangeInfo =
        meta?.startLine != null && meta?.endLine != null
          ? ` [lines ${meta.startLine}-${meta.endLine}]`
          : "";

      return `${header}${rangeInfo}\n\`\`\`${meta?.language ?? ""}\n${item.content}\n\`\`\``;
    });
    return `## Context (Provided reference material)\n${sections.join("\n\n")}`;
  }

  // ─── 构建 Agent 约束 ───
  private buildConstraintSection(): string {
    const constraints: string[] = [
      `Max steps: ${this.config.maxSteps}`,
      `Temperature: ${this.config.temperature}`,
    ];

    if (!this.config.enableFileEdits) {
      constraints.push("File edits are DISABLED — only output code snippets.");
    }
    if (!this.config.enableThinking) {
      constraints.push("Thinking blocks are disabled — respond directly.");
    }

    return `## Agent Constraints\n${constraints.map((c) => `- ${c}`).join("\n")}`;
  }

  // ─── 构建 User Prompt (含变量替换) ───
  buildUserPrompt(
    rawPrompt: string,
    variables?: Record<string, string>,
  ): string {
    if (!variables) return rawPrompt;
    return rawPrompt.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      return variables[key] ?? `{{${key}}}`;
    });
  }

  // ─── 从模板构建 ───
  buildFromTemplate(
    template: PromptTemplate,
    variables: Record<string, string>,
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = new PromptBuilder({
      config: this.config,
      contextItems: this.contextItems,
      memory: this.memory,
      language: template.outputLanguage,
    })
      .withSystemPrompt(template.systemPrompt)
      .buildSystemPrompt();

    // 验证必需变量
    for (const v of template.variables) {
      if (v.required && !variables[v.key]) {
        throw new Error(`Missing required variable: ${v.key}`);
      }
    }

    const userPrompt = this.buildUserPrompt(
      template.description, // 模板描述作为基础 prompt
      variables,
    );

    return { systemPrompt, userPrompt };
  }

  // ─── 链式: 覆盖 system prompt ───
  withSystemPrompt(prompt: string): PromptBuilder {
    this.config = { ...this.config, systemPrompt: prompt };
    return this;
  }
}

// ═══════════════════════════════════════════════════════════════
// 内置 Prompt 模板
// ═══════════════════════════════════════════════════════════════

export const BUILTIN_TEMPLATES: PromptTemplate[] = [
  {
    id: "create-component",
    name: "Create React Component",
    description: "Generate a new React component from a description.",
    systemPrompt:
      "You are a React component generator. Create a single, self-contained, production-ready component.",
    outputLanguage: "react",
    variables: [
      { key: "name", label: "Component Name", type: "text", required: true },
      { key: "description", label: "Description", type: "text", required: true },
    ],
  },
  {
    id: "create-api",
    name: "Create API Route",
    description: "Generate a Next.js API route handler.",
    systemPrompt:
      "You are an API route generator for Next.js App Router. Generate a route handler with proper error handling and validation.",
    outputLanguage: "typescript",
    variables: [
      { key: "path", label: "Route Path", type: "text", required: true },
      { key: "method", label: "HTTP Method", type: "select", required: true, options: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
    ],
  },
  {
    id: "create-sql",
    name: "Create SQL Schema",
    description: "Generate a PostgreSQL schema definition.",
    systemPrompt:
      "You are a database schema designer. Generate PostgreSQL DDL with proper types, constraints, indexes, and comments.",
    outputLanguage: "sql",
    variables: [
      { key: "table", label: "Table Name", type: "text", required: true },
      { key: "fields", label: "Fields Description", type: "text", required: true },
    ],
  },
  {
    id: "refactor",
    name: "Refactor Code",
    description: "Refactor existing code for better structure.",
    systemPrompt:
      "You are a code refactoring expert. Improve code quality while preserving behavior. Explain each change.",
    outputLanguage: "typescript",
    variables: [
      { key: "file", label: "File Path", type: "text", required: true },
      { key: "goal", label: "Refactoring Goal", type: "text", required: true },
    ],
  },
];

// ─── 辅助: 获取模板变量默认值 ───
export function getVariableDefaults(
  variables: PromptVariable[],
): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const v of variables) {
    if (v.defaultValue !== undefined) {
      defaults[v.key] = v.defaultValue;
    }
  }
  return defaults;
}
