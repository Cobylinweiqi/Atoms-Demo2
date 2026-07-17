// ═══════════════════════════════════════════════════════════════
// Theme Export / Import
// 主题导出为 JSON / 从 JSON 导入
// ═══════════════════════════════════════════════════════════════

import type { ThemeTokens, ThemeMode } from "./tokens/types";

// ─── 导出的主题格式 ───
export interface ExportedTheme {
  version: string;
  name: string;
  exportedAt: number;
  dark: ThemeTokens;
  light: ThemeTokens;
}

// ─── 当前版本 ───
const THEME_VERSION = "1.0.0";

// ═══════════════════════════════════════════════════════════════
// 导出主题为 JSON 对象
// ═══════════════════════════════════════════════════════════════

export function exportThemeAsJSON(
  dark: ThemeTokens,
  light: ThemeTokens,
  name: string = "Custom Theme"
): ExportedTheme {
  return {
    version: THEME_VERSION,
    name,
    exportedAt: Date.now(),
    dark,
    light,
  };
}

// ═══════════════════════════════════════════════════════════════
// 从 JSON 导入主题
// ═══════════════════════════════════════════════════════════════

export function importThemeFromJSON(data: ExportedTheme): {
  dark: ThemeTokens;
  light: ThemeTokens;
} {
  // 验证版本
  if (!data.version) {
    throw new Error("Invalid theme: missing version");
  }

  // 验证必要字段
  if (!data.dark?.colors || !data.light?.colors) {
    throw new Error("Invalid theme: missing color tokens");
  }

  return {
    dark: data.dark,
    light: data.light,
  };
}

// ═══════════════════════════════════════════════════════════════
// 下载主题为 .json 文件
// ═══════════════════════════════════════════════════════════════

export function downloadThemeFile(data: ExportedTheme): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.name.toLowerCase().replace(/\s+/g, "-")}-theme.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════
// 生成 CSS 变量文件内容 (用于导出 CSS)
// ═══════════════════════════════════════════════════════════════

export function exportThemeAsCSS(
  dark: ThemeTokens,
  light: ThemeTokens
): string {
  // 动态导入避免 SSR 问题
  const lines: string[] = [
    "/* ═══════════════════════════════════════════════════════════════",
    "   Exported Theme CSS Variables",
    "   ═══════════════════════════════════════════════════════════════ */",
    "",
  ];

  // Dark theme (:root)
  lines.push(":root {");
  lines.push(generateCSSBlock(dark));
  lines.push("}");
  lines.push("");

  // Light theme
  lines.push(".light {");
  lines.push(generateCSSBlock(light));
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

// ─── 生成 CSS 变量块 ───
function generateCSSBlock(tokens: ThemeTokens): string {
  const lines: string[] = [];

  // 颜色
  for (const [key, value] of Object.entries(tokens.colors)) {
    const cssName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    const val = value.a !== undefined
      ? `${value.h} ${value.s}% ${value.l}% / ${value.a}`
      : `${value.h} ${value.s}% ${value.l}%`;
    lines.push(`  ${cssName}: ${val};`);
  }

  // 间距
  for (const [key, value] of Object.entries(tokens.spacing)) {
    lines.push(`  --space-${key}: ${value};`);
  }

  // 圆角
  for (const [key, value] of Object.entries(tokens.radius)) {
    lines.push(`  --radius-${key}: ${value};`);
  }

  // 阴影
  for (const [key, value] of Object.entries(tokens.shadow)) {
    const cssName = `--shadow-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    lines.push(`  ${cssName}: ${value};`);
  }

  return lines.join("\n");
}
