// ═══════════════════════════════════════════════════════════════
// Token → Tailwind Config 生成器
// 生成 Tailwind theme.extend 配置, 全部引用 CSS 变量
// ═══════════════════════════════════════════════════════════════

import type { ThemeTokens } from "./types";

// ═══════════════════════════════════════════════════════════════
// 生成颜色映射 (全部引用 CSS 变量)
// ═══════════════════════════════════════════════════════════════

function generateColorConfig() {
  return {
    background: "hsl(var(--background) / <alpha-value>)",
    foreground: "hsl(var(--foreground) / <alpha-value>)",
    surface: {
      1: "hsl(var(--surface-1) / <alpha-value>)",
      2: "hsl(var(--surface-2) / <alpha-value>)",
      3: "hsl(var(--surface-3) / <alpha-value>)",
      4: "hsl(var(--surface-4) / <alpha-value>)",
    },
    primary: {
      DEFAULT: "hsl(var(--primary) / <alpha-value>)",
      foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
      foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
    },
    accent: {
      DEFAULT: "hsl(var(--accent) / <alpha-value>)",
      foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
    },
    muted: {
      DEFAULT: "hsl(var(--muted) / <alpha-value>)",
      foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
      foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
    },
    success: {
      DEFAULT: "hsl(var(--success) / <alpha-value>)",
      foreground: "hsl(var(--success-foreground) / <alpha-value>)",
    },
    warning: {
      DEFAULT: "hsl(var(--warning) / <alpha-value>)",
      foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
    },
    card: {
      DEFAULT: "hsl(var(--card) / <alpha-value>)",
      foreground: "hsl(var(--card-foreground) / <alpha-value>)",
    },
    popover: {
      DEFAULT: "hsl(var(--popover) / <alpha-value>)",
      foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
    },
    border: "hsl(var(--border) / <alpha-value>)",
    input: "hsl(var(--input) / <alpha-value>)",
    ring: "hsl(var(--ring) / <alpha-value>)",
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成字体族配置
// ═══════════════════════════════════════════════════════════════

function generateFontFamilyConfig() {
  return {
    sans: ["var(--font-sans)"],
    display: ["var(--font-display)"],
    mono: ["var(--font-mono)"],
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成字号配置
// ═══════════════════════════════════════════════════════════════

function generateFontSizeConfig() {
  return {
    xs: ["var(--text-xs)", { lineHeight: "var(--leading-none)" }],
    sm: ["var(--text-sm)", { lineHeight: "var(--leading-tight)" }],
    base: ["var(--text-base)", { lineHeight: "var(--leading-normal)" }],
    lg: ["var(--text-lg)", { lineHeight: "var(--leading-normal)" }],
    xl: ["var(--text-xl)", { lineHeight: "var(--leading-tight)" }],
    "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-tight)" }],
    "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-tight)" }],
    "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-tight)" }],
    "5xl": ["var(--text-5xl)", { lineHeight: "var(--leading-none)" }],
    "6xl": ["var(--text-6xl)", { lineHeight: "var(--leading-none)" }],
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成字重配置
// ═══════════════════════════════════════════════════════════════

function generateFontWeightConfig() {
  return {
    thin: "var(--font-weight-thin)",
    light: "var(--font-weight-light)",
    normal: "var(--font-weight-normal)",
    medium: "var(--font-weight-medium)",
    semibold: "var(--font-weight-semibold)",
    bold: "var(--font-weight-bold)",
    extrabold: "var(--font-weight-extrabold)",
    black: "var(--font-weight-black)",
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成行高配置
// ═══════════════════════════════════════════════════════════════

function generateLineHeightConfig() {
  return {
    none: "var(--leading-none)",
    tight: "var(--leading-tight)",
    snug: "var(--leading-snug)",
    normal: "var(--leading-normal)",
    relaxed: "var(--leading-relaxed)",
    loose: "var(--leading-loose)",
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成字间距配置
// ═══════════════════════════════════════════════════════════════

function generateLetterSpacingConfig() {
  return {
    tighter: "var(--tracking-tighter)",
    tight: "var(--tracking-tight)",
    normal: "var(--tracking-normal)",
    wide: "var(--tracking-wide)",
    wider: "var(--tracking-wider)",
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成间距配置
// ═══════════════════════════════════════════════════════════════

function generateSpacingConfig() {
  const spacing: Record<string, string> = {};
  const keys = ["0", "px", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16", "20", "24", "28", "32", "36", "40", "44", "48", "52", "56", "60", "64", "72", "80", "96"];
  for (const key of keys) {
    spacing[key] = `var(--space-${key})`;
  }
  return spacing;
}

// ═══════════════════════════════════════════════════════════════
// 生成圆角配置
// ═══════════════════════════════════════════════════════════════

function generateBorderRadiusConfig() {
  return {
    none: "var(--radius-none)",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
    "3xl": "var(--radius-3xl)",
    full: "var(--radius-full)",
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成阴影配置
// ═══════════════════════════════════════════════════════════════

function generateBoxShadowConfig() {
  return {
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    xl: "var(--shadow-xl)",
    "2xl": "var(--shadow-2xl)",
    glass: "var(--shadow-glass)",
    glow: "var(--shadow-glow)",
    "glow-lg": "var(--shadow-glow-lg)",
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成过渡配置
// ═══════════════════════════════════════════════════════════════

function generateTransitionConfig() {
  return {
    duration: {
      instant: "var(--duration-instant)",
      fast: "var(--duration-fast)",
      DEFAULT: "var(--duration-normal)",
      slow: "var(--duration-slow)",
      slower: "var(--duration-slower)",
    },
    timingFunction: {
      standard: "var(--ease-standard)",
      in: "var(--ease-in)",
      out: "var(--ease-out)",
      "in-out": "var(--ease-in-out)",
      spring: "var(--ease-spring)",
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成背景渐变配置
// ═══════════════════════════════════════════════════════════════

function generateBackgroundImageConfig() {
  return {
    "gradient-brand": "var(--gradient-brand)",
    "gradient-brand-soft": "var(--gradient-brand-soft)",
    "gradient-text": "var(--gradient-text)",
  };
}

// ═══════════════════════════════════════════════════════════════
// 生成关键帧 + 动画配置
// ═══════════════════════════════════════════════════════════════

function generateAnimationConfig(tokens: ThemeTokens) {
  const keyframes: Record<string, Record<string, Record<string, string>>> = {};
  const animation: Record<string, string> = {};

  for (const [name, steps] of Object.entries(tokens.motion.keyframes)) {
    keyframes[name] = steps;
    animation[name] = `${name} var(--duration-normal) var(--ease-standard) infinite`;
  }

  // 特殊动画 (非循环)
  animation["fade-in"] = "fade-in var(--duration-normal) var(--ease-out)";
  animation["slide-up"] = "slide-up var(--duration-normal) var(--ease-out)";
  animation["scale-in"] = "scale-in var(--duration-fast) var(--ease-spring)";

  return { keyframes, animation };
}

// ═══════════════════════════════════════════════════════════════
// 生成完整 Tailwind theme.extend 配置
// ═══════════════════════════════════════════════════════════════

export function generateTailwindExtend(tokens: ThemeTokens) {
  const { keyframes, animation } = generateAnimationConfig(tokens);

  return {
    fontFamily: generateFontFamilyConfig(),
    fontSize: generateFontSizeConfig(),
    fontWeight: generateFontWeightConfig(),
    lineHeight: generateLineHeightConfig(),
    letterSpacing: generateLetterSpacingConfig(),
    colors: generateColorConfig(),
    spacing: generateSpacingConfig(),
    borderRadius: generateBorderRadiusConfig(),
    boxShadow: generateBoxShadowConfig(),
    transitionDuration: generateTransitionConfig().duration,
    transitionTimingFunction: generateTransitionConfig().timingFunction,
    backgroundImage: generateBackgroundImageConfig(),
    keyframes,
    animation,
  };
}
