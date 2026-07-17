// ═══════════════════════════════════════════════════════════════
// File Diff — File Diff 处理
// 职责: 解析 / 渲染 / 应用 / 回滚 文件变更
// 支持: Unified Diff / 行级 Diff / Accept / Reject / 合并冲突解决
// ═══════════════════════════════════════════════════════════════

import type { FileChangeBlock, FileChangeAction } from "../types";

// ─── Diff 行类型 ───
export type DiffLineType = "context" | "add" | "delete" | "hunk_header";

export interface DiffLine {
  type: DiffLineType;
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffHunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: DiffLine[];
}

// ═══════════════════════════════════════════════════════════════
// FileDiffProcessor
// ═══════════════════════════════════════════════════════════════

export class FileDiffProcessor {
  // ─── 解析 Unified Diff ───
  parseUnifiedDiff(diffText: string): DiffHunk[] {
    const lines = diffText.split("\n");
    const hunks: DiffHunk[] = [];
    let currentHunk: DiffHunk | null = null;
    let oldLine = 0;
    let newLine = 0;

    for (const line of lines) {
      // Hunk header: @@ -oldStart,oldCount +newStart,newCount @@
      const hunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (hunkMatch) {
        if (currentHunk) hunks.push(currentHunk);
        currentHunk = {
          oldStart: parseInt(hunkMatch[1], 10),
          oldCount: hunkMatch[2] ? parseInt(hunkMatch[2], 10) : 1,
          newStart: parseInt(hunkMatch[3], 10),
          newCount: hunkMatch[4] ? parseInt(hunkMatch[4], 10) : 1,
          lines: [],
        };
        oldLine = currentHunk.oldStart;
        newLine = currentHunk.newStart;
        currentHunk.lines.push({ type: "hunk_header", content: line });
        continue;
      }

      if (!currentHunk) continue;

      if (line.startsWith(" ")) {
        currentHunk.lines.push({
          type: "context",
          content: line.slice(1),
          oldLineNumber: oldLine,
          newLineNumber: newLine,
        });
        oldLine++;
        newLine++;
      } else if (line.startsWith("+")) {
        currentHunk.lines.push({
          type: "add",
          content: line.slice(1),
          newLineNumber: newLine,
        });
        newLine++;
      } else if (line.startsWith("-")) {
        currentHunk.lines.push({
          type: "delete",
          content: line.slice(1),
          oldLineNumber: oldLine,
        });
        oldLine++;
      } else if (line.startsWith("---") || line.startsWith("+++")) {
        // File headers, skip
        continue;
      }
    }

    if (currentHunk) hunks.push(currentHunk);
    return hunks;
  }

  // ─── 渲染 Diff 为 HTML (带颜色) ───
  renderDiffHtml(hunks: DiffHunk[]): string {
    const html: string[] = [];

    for (const hunk of hunks) {
      for (const line of hunk.lines) {
        const escaped = this.escapeHtml(line.content);

        switch (line.type) {
          case "hunk_header":
            html.push(
              `<div class="diff-hunk-header">${escaped}</div>`,
            );
            break;
          case "context":
            html.push(
              `<div class="diff-line diff-context"><span class="diff-lineno">${line.oldLineNumber ?? ""}</span><span class="diff-content">${escaped}</span></div>`,
            );
            break;
          case "add":
            html.push(
              `<div class="diff-line diff-add"><span class="diff-lineno">+</span><span class="diff-content">${escaped}</span></div>`,
            );
            break;
          case "delete":
            html.push(
              `<div class="diff-line diff-delete"><span class="diff-lineno">-</span><span class="diff-content">${escaped}</span></div>`,
            );
            break;
        }
      }
    }

    return html.join("\n");
  }

  // ─── 统计变更 ───
  getStats(hunks: DiffHunk[]): { additions: number; deletions: number; changes: number } {
    let additions = 0;
    let deletions = 0;

    for (const hunk of hunks) {
      for (const line of hunk.lines) {
        if (line.type === "add") additions++;
        else if (line.type === "delete") deletions++;
      }
    }

    return { additions, deletions, changes: additions + deletions };
  }

  // ─── 应用文件变更 (Accept) ───
  applyChange(change: FileChangeBlock): { filename: string; content: string; action: FileChangeAction } {
    return {
      filename: change.filename,
      content: change.newContent,
      action: change.action,
    };
  }

  // ─── 回滚文件变更 (Reject) ───
  revertChange(change: FileChangeBlock): { filename: string; content: string; action: FileChangeAction } | null {
    if (change.action === "create") {
      // 创建的文件被拒绝 → 删除
      return { filename: change.filename, content: "", action: "delete" };
    }
    if (change.action === "modify") {
      // 修改的文件被拒绝 → 恢复旧内容
      return { filename: change.filename, content: change.oldContent, action: "modify" };
    }
    // delete 被拒绝 → 不做任何事
    return null;
  }

  // ─── 行级 Diff (用于内联展示) ───
  lineDiff(oldText: string, newText: string): DiffLine[] {
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");
    const result: DiffLine[] = [];

    // 简单对比: 逐行比较
    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === newLine) {
        if (oldLine !== undefined) {
          result.push({ type: "context", content: oldLine, oldLineNumber: i + 1, newLineNumber: i + 1 });
        }
      } else {
        if (oldLine !== undefined) {
          result.push({ type: "delete", content: oldLine, oldLineNumber: i + 1 });
        }
        if (newLine !== undefined) {
          result.push({ type: "add", content: newLine, newLineNumber: i + 1 });
        }
      }
    }

    return result;
  }

  // ─── 合并多个变更 (解决冲突) ───
  mergeChanges(changes: FileChangeBlock[]): FileChangeBlock[] {
    // 按 filename 分组
    const grouped = new Map<string, FileChangeBlock[]>();
    for (const change of changes) {
      const group = grouped.get(change.filename) ?? [];
      group.push(change);
      grouped.set(change.filename, group);
    }

    const merged: FileChangeBlock[] = [];
    for (const [filename, group] of Array.from(grouped.entries())) {
      if (group.length === 1) {
        merged.push(group[0]);
      } else {
        // 多个变更合并: 最后一个的 newContent 作为最终内容
        const last = group[group.length - 1];
        const first = group[0];
        merged.push({
          ...last,
          oldContent: first.oldContent,
          newContent: last.newContent,
        });
      }
    }

    return merged;
  }

  // ─── 生成变更摘要 ───
  summarizeChange(change: FileChangeBlock): string {
    const actionVerb = {
      create: "Created",
      modify: "Modified",
      delete: "Deleted",
    }[change.action];

    const hunks = this.parseUnifiedDiff(change.diff);
    const stats = this.getStats(hunks);

    return `${actionVerb} ${change.filename} (+${stats.additions} -${stats.deletions})`;
  }

  // ─── HTML 转义 ───
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// ─── 单例 ───
let _processor: FileDiffProcessor | null = null;
export function getFileDiffProcessor(): FileDiffProcessor {
  if (!_processor) _processor = new FileDiffProcessor();
  return _processor;
}
