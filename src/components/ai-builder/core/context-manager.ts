// ═══════════════════════════════════════════════════════════════
// Context Manager — Context 管理
// 职责: 管理文件 / 图片 / 选区 / URL / Memory / 对话 / 代码库 上下文
// 提供: 添加 / 移除 / 序列化 / Token 估算 / 去重
// ═══════════════════════════════════════════════════════════════

import type { ContextItem, ContextType, OutputLanguage } from "../types";

// ─── 生成 ID ───
function genId(): string {
  return `ctx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Token 估算 (粗略: ~4 chars = 1 token) ───
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ─── 语言推断 ───
function inferLanguage(filename: string): OutputLanguage {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, OutputLanguage> = {
    tsx: "react",
    jsx: "react",
    ts: "typescript",
    js: "javascript",
    html: "html",
    css: "css",
    sql: "sql",
    md: "markdown",
    json: "json",
  };
  return map[ext] ?? "text" as OutputLanguage;
}

// ═══════════════════════════════════════════════════════════════
// ContextManager
// ═══════════════════════════════════════════════════════════════

export class ContextManager {
  private items: Map<string, ContextItem> = new Map();
  private maxTokens: number;
  private maxItems: number;

  constructor(options?: { maxTokens?: number; maxItems?: number }) {
    this.maxTokens = options?.maxTokens ?? 50000;
    this.maxItems = options?.maxItems ?? 20;
  }

  // ─── 添加文件上下文 ───
  addFile(
    filename: string,
    content: string,
    options?: { startLine?: number; endLine?: number },
  ): ContextItem {
    const language = inferLanguage(filename);
    const item: ContextItem = {
      id: genId(),
      type: "file",
      label: filename,
      content: options?.startLine
        ? this.extractLines(content, options.startLine, options.endLine ?? options.startLine)
        : content,
      meta: {
        filename,
        language,
        size: content.length,
        startLine: options?.startLine,
        endLine: options?.endLine,
      },
    };
    return this.add(item);
  }

  // ─── 添加图片上下文 (base64 or URL) ───
  addImage(url: string, alt?: string): ContextItem {
    const item: ContextItem = {
      id: genId(),
      type: "image",
      label: alt ?? "image",
      content: url,
      meta: { mimeType: "image/*" },
    };
    return this.add(item);
  }

  // ─── 添加代码选区上下文 ───
  addSelection(
    filename: string,
    code: string,
    startLine: number,
    endLine: number,
  ): ContextItem {
    const language = inferLanguage(filename);
    const item: ContextItem = {
      id: genId(),
      type: "selection",
      label: `${filename}:${startLine}-${endLine}`,
      content: code,
      meta: { filename, language, startLine, endLine },
    };
    return this.add(item);
  }

  // ─── 添加 URL 上下文 ───
  addUrl(url: string, content: string): ContextItem {
    const item: ContextItem = {
      id: genId(),
      type: "url",
      label: url,
      content,
    };
    return this.add(item);
  }

  // ─── 添加 Memory 上下文 ───
  addMemory(key: string, value: string): ContextItem {
    const item: ContextItem = {
      id: genId(),
      type: "memory",
      label: `Memory: ${key}`,
      content: value,
    };
    return this.add(item);
  }

  // ─── 添加对话历史上下文 ───
  addConversation(summary: string): ContextItem {
    const item: ContextItem = {
      id: genId(),
      type: "conversation",
      label: "Conversation History",
      content: summary,
    };
    return this.add(item);
  }

  // ─── 添加代码库上下文 (项目结构) ───
  addCodebase(structure: string): ContextItem {
    const item: ContextItem = {
      id: genId(),
      type: "codebase",
      label: "Codebase Structure",
      content: structure,
    };
    return this.add(item);
  }

  // ─── 核心添加 (去重 + 限额) ───
  private add(item: ContextItem): ContextItem {
    // 去重: 同 type + label 已存在则更新
    for (const [id, existing] of Array.from(this.items.entries())) {
      if (existing.type === item.type && existing.label === item.label) {
        this.items.set(id, { ...existing, ...item, id });
        return { ...existing, ...item, id };
      }
    }

    // 限额检查
    if (this.items.size >= this.maxItems) {
      // 移除最早的非 pinned 项
      const firstKey = this.items.keys().next().value;
      if (firstKey) this.items.delete(firstKey);
    }

    this.items.set(item.id, item);
    return item;
  }

  // ─── 移除 ───
  remove(id: string): void {
    this.items.delete(id);
  }

  // ─── 清空 ───
  clear(): void {
    this.items.clear();
  }

  // ─── 获取全部 ───
  getAll(): ContextItem[] {
    return Array.from(this.items.values());
  }

  // ─── 按 ID 获取 ───
  get(id: string): ContextItem | undefined {
    return this.items.get(id);
  }

  // ─── 按类型筛选 ───
  getByType(type: ContextType): ContextItem[] {
    return this.getAll().filter((i) => i.type === type);
  }

  // ─── Token 估算 ───
  getTokens(): number {
    return this.getAll().reduce(
      (sum, item) => sum + estimateTokens(item.content),
      0,
    );
  }

  // ─── 序列化为 Prompt 字符串 ───
  serialize(): string {
    const items = this.getAll();
    if (items.length === 0) return "";

    const sections = items.map((item) => {
      const header = `[${item.type.toUpperCase()}] ${item.label}`;
      const meta =
        item.meta?.startLine != null
          ? ` (lines ${item.meta.startLine}-${item.meta?.endLine})`
          : "";
      return `${header}${meta}\n${item.content}`;
    });

    return sections.join("\n\n---\n\n");
  }

  // ─── 提取行范围 ───
  private extractLines(
    content: string,
    start: number,
    end: number,
  ): string {
    const lines = content.split("\n");
    return lines.slice(start - 1, end).join("\n");
  }

  // ─── 检查是否超出 Token 限额 ───
  isOverLimit(): boolean {
    return this.getTokens() > this.maxTokens;
  }

  // ─── 获取摘要统计 ───
  getStats(): {
    count: number;
    tokens: number;
    byType: Record<ContextType, number>;
  } {
    const byType = {} as Record<ContextType, number>;
    for (const item of this.getAll()) {
      byType[item.type] = (byType[item.type] ?? 0) + 1;
    }
    return {
      count: this.items.size,
      tokens: this.getTokens(),
      byType,
    };
  }
}
