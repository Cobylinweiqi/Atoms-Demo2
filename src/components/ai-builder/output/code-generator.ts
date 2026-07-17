// ═══════════════════════════════════════════════════════════════
// Code Generator — 代码生成器
// 职责: 生成 React / HTML / CSS / SQL / Markdown 代码
// 支持: 模板 / 代码片段 / 文件内容组装
// ═══════════════════════════════════════════════════════════════

import type { OutputLanguage, FileChangeBlock } from "../types";

// ─── 生成 ID ───
function genId(): string {
  return `fc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// ═══════════════════════════════════════════════════════════════
// CodeGenerator
// ═══════════════════════════════════════════════════════════════

export class CodeGenerator {
  // ─── 生成 React 组件 ───
  generateReactComponent(options: {
    name: string;
    props?: Record<string, string>;
    children?: string;
    styling?: "tailwind" | "css" | "styled";
  }): string {
    const { name, props = {}, children = "Hello", styling = "tailwind" } = options;

    const propString = Object.entries(props)
      .map(([key, type]) => `${key}: ${type}`)
      .join("; ");

    const propsType = propString ? `{ ${propString} }` : "{}";
    const className =
      styling === "tailwind"
        ? 'className="rounded-xl bg-gradient-brand px-6 py-3 text-white shadow-glow transition-all hover:-translate-y-0.5"'
        : "";

    return `export function ${name}(props: ${propsType}) {
  return (
    <div ${className}>
      {${children}}
    </div>
  );
}`;
  }

  // ─── 生成 HTML 页面 ───
  generateHtmlPage(options: {
    title: string;
    body: string;
    includeStyles?: boolean;
  }): string {
    const { title, body, includeStyles = true } = options;
    const styleBlock = includeStyles
      ? `\n  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: var(--background, #0a0a0f); color: var(--foreground, #fff); }
  </style>`
      : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>${styleBlock}
</head>
<body>
  ${body}
</body>
</html>`;
  }

  // ─── 生成 CSS ───
  generateCss(options: {
    selector: string;
    properties: Record<string, string>;
    useVariables?: boolean;
  }): string {
    const { selector, properties, useVariables = true } = options;
    const props = Object.entries(properties)
      .map(([key, value]) => {
        // 颜色值自动映射到 CSS 变量
        if (useVariables && /^#[0-9a-fA-F]{3,8}$/.test(value)) {
          return `  ${key}: var(--color-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}, ${value});`;
        }
        return `  ${key}: ${value};`;
      })
      .join("\n");

    return `${selector} {
${props}
}`;
  }

  // ─── 生成 SQL ───
  generateSql(options: {
    type: "create_table" | "create_index" | "select" | "insert" | "migration";
    table?: string;
    columns?: Array<{ name: string; type: string; constraints?: string[] }>;
    fields?: Array<{ name: string; type: string }>;
    values?: Record<string, unknown>[];
  }): string {
    const { type, table = "table_name", columns = [], fields = [], values = [] } = options;

    switch (type) {
      case "create_table":
        const colDefs = columns
          .map((c) => `  ${c.name} ${c.type}${c.constraints?.length ? ` ${c.constraints.join(" ")}` : ""}`)
          .join(",\n");
        return `CREATE TABLE IF NOT EXISTS ${table} (
${colDefs}
);

-- Indexes
${columns
  .filter((c) => c.constraints?.includes("UNIQUE") || c.name === "id")
  .map((c) => `CREATE INDEX idx_${table}_${c.name} ON ${table}(${c.name});`)
  .join("\n")}`;

      case "create_index":
        return `CREATE INDEX IF NOT EXISTS idx_${table}_${fields.map((f) => f.name).join("_")}
ON ${table}(${fields.map((f) => f.name).join(", ")});`;

      case "select":
        const selectFields = fields.length > 0 ? fields.map((f) => f.name).join(", ") : "*";
        return `SELECT ${selectFields}
FROM ${table}
ORDER BY created_at DESC
LIMIT 100;`;

      case "insert":
        if (values.length === 0) return "-- No values provided";
        const cols = Object.keys(values[0]).join(", ");
        const vals = values
          .map(
            (v) =>
              `  (${Object.values(v)
                .map((val) => (typeof val === "string" ? `'${val}'` : String(val)))
                .join(", ")})`,
          )
          .join(",\n");
        return `INSERT INTO ${table} (${cols})
VALUES
${vals}
RETURNING *;`;

      case "migration":
        return `-- Migration: ${table}
BEGIN;

${this.generateSql({ type: "create_table", table, columns })}

COMMIT;`;

      default:
        return "-- Unknown SQL type";
    }
  }

  // ─── 生成 Markdown ───
  generateMarkdown(options: {
    title?: string;
    sections?: Array<{ heading: string; content: string; level?: number }>;
    codeBlocks?: Array<{ language: string; code: string }>;
    table?: { headers: string[]; rows: string[][] };
  }): string {
    const { title, sections = [], codeBlocks = [], table } = options;
    const parts: string[] = [];

    if (title) parts.push(`# ${title}\n`);

    for (const section of sections) {
      const hashes = "#".repeat(section.level ?? 2);
      parts.push(`${hashes} ${section.heading}\n\n${section.content}\n`);
    }

    for (const block of codeBlocks) {
      parts.push(`\`\`\`${block.language}\n${block.code}\n\`\`\`\n`);
    }

    if (table) {
      parts.push(
        `| ${table.headers.join(" | ")} |\n| ${table.headers.map(() => "---").join(" | ")} |\n`,
      );
      for (const row of table.rows) {
        parts.push(`| ${row.join(" | ")} |`);
      }
      parts.push("");
    }

    return parts.join("\n").trim();
  }

  // ─── 创建文件变更块 ───
  createFileChange(options: {
    filename: string;
    language: OutputLanguage;
    action: "create" | "modify" | "delete";
    oldContent?: string;
    newContent: string;
    reason?: string;
    diff?: string;
  }): FileChangeBlock {
    const { filename, language, action, oldContent = "", newContent, reason, diff } = options;
    return {
      id: genId(),
      type: "file_change",
      filename,
      language,
      action,
      oldContent,
      newContent,
      diff: diff ?? this.generateUnifiedDiff(oldContent, newContent, filename),
      status: "pending",
      reason,
    };
  }

  // ─── 生成 Unified Diff ───
  generateUnifiedDiff(oldText: string, newText: string, filename: string): string {
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");
    const diff: string[] = [`--- a/${filename}`, `+++ b/${filename}`];

    // 简单 LCS diff
    const { lcs, operations } = this.lcsDiff(oldLines, newLines);

    // 生成 hunks
    let oldStart = 1;
    let newStart = 1;
    let hunkLines: string[] = [];

    for (const op of operations) {
      if (op.type === "equal") {
        hunkLines.push(` ${op.value}`);
        oldStart++;
        newStart++;
      } else if (op.type === "delete") {
        hunkLines.push(`-${op.value}`);
        oldStart++;
      } else if (op.type === "insert") {
        hunkLines.push(`+${op.value}`);
        newStart++;
      }
    }

    const oldCount = oldLines.length;
    const newCount = newLines.length;
    diff.push(`@@ -1,${oldCount} +1,${newCount} @@`);
    diff.push(...hunkLines);

    return diff.join("\n");
  }

  // ─── LCS Diff 算法 ───
  private lcsDiff(
    oldLines: string[],
    newLines: string[],
  ): { lcs: string[]; operations: Array<{ type: "equal" | "delete" | "insert"; value: string }> } {
    const m = oldLines.length;
    const n = newLines.length;

    // 构建 DP 表
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
      new Array(n + 1).fill(0),
    );

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // 回溯
    const operations: Array<{ type: "equal" | "delete" | "insert"; value: string }> = [];
    let i = m;
    let j = n;

    while (i > 0 && j > 0) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        operations.unshift({ type: "equal", value: oldLines[i - 1] });
        i--;
        j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        operations.unshift({ type: "delete", value: oldLines[i - 1] });
        i--;
      } else {
        operations.unshift({ type: "insert", value: newLines[j - 1] });
        j--;
      }
    }

    while (i > 0) {
      operations.unshift({ type: "delete", value: oldLines[i - 1] });
      i--;
    }
    while (j > 0) {
      operations.unshift({ type: "insert", value: newLines[j - 1] });
      j--;
    }

    return { lcs: [], operations };
  }
}

// ─── 单例 ───
let _generator: CodeGenerator | null = null;
export function getCodeGenerator(): CodeGenerator {
  if (!_generator) _generator = new CodeGenerator();
  return _generator;
}
