// ═══════════════════════════════════════════════════════════════
// Token → CSS Variable 生成器
// 将 ThemeTokens 转换为 CSS 自定义属性字符串
// ═══════════════════════════════════════════════════════════════

import type { ThemeTokens, HSLValue } from "./types";

// ─── HSLValue → CSS hsl() 字符串 ───
export function hslToString(value: HSLValue): string {
  if (value.a !== undefined) {
    return `${value.h} ${value.s}% ${value.l}% / ${value.a}`;
  }
  return `${value.h} ${value.s}% ${value.l}%`;
}

// ─── 驼峰转 kebab-case ───
function toKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// ═══════════════════════════════════════════════════════════════
// 生成颜色 CSS 变量
// ═══════════════════════════════════════════════════════════════

function generateColorVars(colors: ThemeTokens["colors"]): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(colors)) {
    const cssName = `--${toKebab(key)}`;
    lines.push(`  ${cssName}: ${hslToString(value)};`);
  }
  return lines;
}

// ═══════════════════════════════════════════════════════════════
// 生成排版 CSS 变量
// ═══════════════════════════════════════════════════════════════

function generateTypographyVars(typo: ThemeTokens["typography"]): string[] {
  const lines: string[] = [];

  // 字体族
  for (const [key, value] of Object.entries(typo.fontFamily)) {
    lines.push(`  --font-${key}: ${value};`);
  }

  // 字号
  for (const [key, value] of Object.entries(typo.fontSize)) {
    lines.push(`  --text-${key}: ${value};`);
  }

  // 字重
  for (const [key, value] of Object.entries(typo.fontWeight)) {
    lines.push(`  --font-weight-${key}: ${value};`);
  }

  // 行高
  for (const [key, value] of Object.entries(typo.lineHeight)) {
    lines.push(`  --leading-${key}: ${value};`);
  }

  // 字间距
  for (const [key, value] of Object.entries(typo.letterSpacing)) {
    lines.push(`  --tracking-${key}: ${value};`);
  }

  return lines;
}

// ═══════════════════════════════════════════════════════════════
// 生成间距 CSS 变量
// ═══════════════════════════════════════════════════════════════

function generateSpacingVars(spacing: ThemeTokens["spacing"]): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --space-${key}: ${value};`);
  }
  return lines;
}

// ═══════════════════════════════════════════════════════════════
// 生成圆角 CSS 变量
// ═══════════════════════════════════════════════════════════════

function generateRadiusVars(radius: ThemeTokens["radius"]): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --radius-${key}: ${value};`);
  }
  return lines;
}

// ═══════════════════════════════════════════════════════════════
// 生成阴影 CSS 变量
// ═══════════════════════════════════════════════════════════════

function generateShadowVars(shadow: ThemeTokens["shadow"]): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(shadow)) {
    const cssName = `--shadow-${toKebab(key)}`;
    lines.push(`  ${cssName}: ${value};`);
  }
  return lines;
}

// ═══════════════════════════════════════════════════════════════
// 生成动画 CSS 变量
// ═══════════════════════════════════════════════════════════════

function generateMotionVars(motion: ThemeTokens["motion"]): string[] {
  const lines: string[] = [];

  // 时长
  for (const [key, value] of Object.entries(motion.duration)) {
    lines.push(`  --duration-${key}: ${value};`);
  }

  // 缓动
  for (const [key, value] of Object.entries(motion.easing)) {
    lines.push(`  --ease-${key}: ${value};`);
  }

  return lines;
}

// ═══════════════════════════════════════════════════════════════
// 生成渐变 CSS 变量
// ═══════════════════════════════════════════════════════════════

function generateGradientVars(gradient: ThemeTokens["gradient"]): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(gradient)) {
    lines.push(`  --gradient-${toKebab(key)}: ${value};`);
  }
  return lines;
}

// ═══════════════════════════════════════════════════════════════
// 生成关键帧 CSS
// ═══════════════════════════════════════════════════════════════

function generateKeyframesCSS(keyframes: ThemeTokens["motion"]["keyframes"]): string {
  const blocks: string[] = [];
  for (const [name, steps] of Object.entries(keyframes)) {
    const stepLines: string[] = [];
    for (const [step, props] of Object.entries(steps)) {
      const propLines = Object.entries(props)
        .map(([prop, val]) => `      ${prop}: ${val};`)
        .join("\n");
      stepLines.push(`    ${step} {\n${propLines}\n    }`);
    }
    blocks.push(`  @keyframes ${name} {\n${stepLines.join("\n")}\n  }`);
  }
  return blocks.join("\n\n");
}

// ═══════════════════════════════════════════════════════════════
// 生成完整 CSS 变量块 (用于 :root 或 .light)
// ═══════════════════════════════════════════════════════════════

export function generateCSSVars(tokens: ThemeTokens): string {
  const lines: string[] = [
    "/* ═══ Auto-generated from Design Tokens — DO NOT EDIT MANUALLY ═══ */",
    "/* Colors */",
    ...generateColorVars(tokens.colors),
    "/* Typography */",
    ...generateTypographyVars(tokens.typography),
    "/* Spacing */",
    ...generateSpacingVars(tokens.spacing),
    "/* Radius */",
    ...generateRadiusVars(tokens.radius),
    "/* Shadow */",
    ...generateShadowVars(tokens.shadow),
    "/* Motion */",
    ...generateMotionVars(tokens.motion),
    "/* Gradient */",
    ...generateGradientVars(tokens.gradient),
  ];
  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════
// 生成关键帧 CSS 字符串
// ═══════════════════════════════════════════════════════════════

export function generateKeyframes(tokens: ThemeTokens): string {
  return generateKeyframesCSS(tokens.motion.keyframes);
}

// ═══════════════════════════════════════════════════════════════
// 运行时注入 CSS 变量到 document
// 用于 ThemeProvider 动态切换主题
// ═══════════════════════════════════════════════════════════════

export function injectCSSVars(tokens: ThemeTokens, mode: "dark" | "light"): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const styleId = "theme-tokens-runtime";

  // 颜色变量
  for (const [key, value] of Object.entries(tokens.colors)) {
    const cssName = `--${toKebab(key)}`;
    root.style.setProperty(cssName, hslToString(value));
  }

  // 间距变量
  for (const [key, value] of Object.entries(tokens.spacing)) {
    root.style.setProperty(`--space-${key}`, value);
  }

  // 圆角变量
  for (const [key, value] of Object.entries(tokens.radius)) {
    root.style.setProperty(`--radius-${key}`, value);
  }

  // 阴影变量
  for (const [key, value] of Object.entries(tokens.shadow)) {
    const cssName = `--shadow-${toKebab(key)}`;
    root.style.setProperty(cssName, value);
  }

  // 动画时长
  for (const [key, value] of Object.entries(tokens.motion.duration)) {
    root.style.setProperty(`--duration-${key}`, value);
  }

  // 缓动函数
  for (const [key, value] of Object.entries(tokens.motion.easing)) {
    root.style.setProperty(`--ease-${key}`, value);
  }

  // 渐变
  for (const [key, value] of Object.entries(tokens.gradient)) {
    root.style.setProperty(`--gradient-${toKebab(key)}`, value);
  }

  // 排版
  for (const [key, value] of Object.entries(tokens.typography.fontFamily)) {
    root.style.setProperty(`--font-${key}`, value);
  }
  for (const [key, value] of Object.entries(tokens.typography.fontSize)) {
    root.style.setProperty(`--text-${key}`, value);
  }
  for (const [key, value] of Object.entries(tokens.typography.fontWeight)) {
    root.style.setProperty(`--font-weight-${key}`, String(value));
  }
  for (const [key, value] of Object.entries(tokens.typography.lineHeight)) {
    root.style.setProperty(`--leading-${key}`, value);
  }
  for (const [key, value] of Object.entries(tokens.typography.letterSpacing)) {
    root.style.setProperty(`--tracking-${key}`, value);
  }

  // 注: class (dark/light) 由 next-themes 管理, 此处不处理

  // 标记已注入
  if (!document.getElementById(styleId)) {
    const marker = document.createElement("meta");
    marker.id = styleId;
    marker.name = "theme-tokens";
    marker.content = "runtime";
    document.head.appendChild(marker);
  }
}
