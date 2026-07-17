// ═══════════════════════════════════════════════════════════════
// 默认主题 Token — Dark + Light 预设
// 所有颜色使用 HSL 格式, 运行时通过 CSS 变量注入
// ═══════════════════════════════════════════════════════════════

import type {
  ThemeTokens,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  RadiusTokens,
  ShadowTokens,
  MotionTokens,
  GradientTokens,
  HSLValue,
} from "./types";

// ─── HSL 快捷构造 ───
const hsl = (h: number, s: number, l: number, a?: number): HSLValue => ({ h, s, l, a });

// ═══════════════════════════════════════════════════════════════
// Dark 主题颜色
// ═══════════════════════════════════════════════════════════════

const darkColors: ColorTokens = {
  background:       hsl(240, 10, 4),      // #07070B
  surface1:         hsl(240, 10, 6),      // #0B0B12
  surface2:         hsl(240, 10, 9),      // #11111A
  surface3:         hsl(240, 8, 12),      // #181822
  surface4:         hsl(240, 8, 15),      // #20202C
  foreground:       hsl(0, 0, 98),        // #FAFAFA
  muted:            hsl(240, 6, 10),
  mutedForeground:  hsl(240, 5, 64),      // #A1A1AA
  primary:          hsl(239, 84, 67),     // #6366F1
  primaryForeground: hsl(0, 0, 100),
  secondary:        hsl(258, 90, 66),     // #8B5CF6
  secondaryForeground: hsl(0, 0, 100),
  accent:           hsl(189, 94, 43),     // #06B6D4
  accentForeground: hsl(0, 0, 100),
  success:          hsl(160, 84, 39),     // #10B981
  successForeground: hsl(0, 0, 100),
  warning:          hsl(38, 92, 50),      // #F59E0B
  warningForeground: hsl(0, 0, 100),
  destructive:      hsl(0, 84, 60),       // #EF4444
  destructiveForeground: hsl(0, 0, 100),
  card:             hsl(240, 10, 6),      // #0B0B12
  cardForeground:   hsl(0, 0, 98),
  popover:          hsl(240, 10, 9),      // #11111A
  popoverForeground: hsl(0, 0, 98),
  border:           hsl(0, 0, 100),       // used with alpha
  input:            hsl(0, 0, 100),
  ring:             hsl(239, 84, 67),     // primary
};

// ═══════════════════════════════════════════════════════════════
// Light 主题颜色
// ═══════════════════════════════════════════════════════════════

const lightColors: ColorTokens = {
  background:       hsl(0, 0, 100),
  surface1:         hsl(0, 0, 98),
  surface2:         hsl(0, 0, 96),
  surface3:         hsl(0, 0, 94),
  surface4:         hsl(0, 0, 92),
  foreground:       hsl(240, 10, 4),
  muted:            hsl(0, 0, 96),
  mutedForeground:  hsl(240, 4, 46),
  primary:          hsl(239, 84, 67),     // #6366F1
  primaryForeground: hsl(0, 0, 100),
  secondary:        hsl(258, 90, 66),     // #8B5CF6
  secondaryForeground: hsl(0, 0, 100),
  accent:           hsl(189, 94, 43),     // #06B6D4
  accentForeground: hsl(0, 0, 100),
  success:          hsl(160, 84, 39),     // #10B981
  successForeground: hsl(0, 0, 100),
  warning:          hsl(38, 92, 50),      // #F59E0B
  warningForeground: hsl(0, 0, 100),
  destructive:      hsl(0, 84, 60),       // #EF4444
  destructiveForeground: hsl(0, 0, 100),
  card:             hsl(0, 0, 100),
  cardForeground:   hsl(240, 10, 4),
  popover:          hsl(0, 0, 100),
  popoverForeground: hsl(240, 10, 4),
  border:           hsl(240, 6, 90),
  input:            hsl(240, 6, 90),
  ring:             hsl(239, 84, 67),
};

// ═══════════════════════════════════════════════════════════════
// 排版 Token (Dark/Light 共用)
// ═══════════════════════════════════════════════════════════════

const typography: TypographyTokens = {
  fontFamily: {
    sans: "var(--font-inter), system-ui, sans-serif",
    display: "var(--font-satoshi), var(--font-inter), sans-serif",
    mono: "var(--font-jetbrains), monospace",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
  },
};

// ═══════════════════════════════════════════════════════════════
// 间距 Token (Dark/Light 共用)
// ═══════════════════════════════════════════════════════════════

const spacing: SpacingTokens = {
  0: "0px",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
};

// ═══════════════════════════════════════════════════════════════
// 圆角 Token (Dark/Light 共用)
// ═══════════════════════════════════════════════════════════════

const radius: RadiusTokens = {
  none: "0px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
};

// ═══════════════════════════════════════════════════════════════
// 阴影 Token
// ═══════════════════════════════════════════════════════════════

const darkShadow: ShadowTokens = {
  xs: "0 1px 2px hsl(0 0% 0% / 0.20)",
  sm: "0 2px 8px hsl(0 0% 0% / 0.20)",
  md: "0 4px 16px hsl(0 0% 0% / 0.24)",
  lg: "0 8px 32px hsl(0 0% 0% / 0.28)",
  xl: "0 16px 48px hsl(0 0% 0% / 0.32)",
  "2xl": "0 24px 64px hsl(0 0% 0% / 0.36)",
  glass: "0 8px 32px hsl(0 0% 0% / 0.24), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
  glow: "0 0 40px hsl(var(--primary) / 0.30)",
  glowLg: "0 0 80px hsl(var(--primary) / 0.20)",
};

const lightShadow: ShadowTokens = {
  xs: "0 1px 2px hsl(240 10% 0% / 0.05)",
  sm: "0 2px 8px hsl(240 10% 0% / 0.08)",
  md: "0 4px 16px hsl(240 10% 0% / 0.10)",
  lg: "0 8px 32px hsl(240 10% 0% / 0.12)",
  xl: "0 16px 48px hsl(240 10% 0% / 0.14)",
  "2xl": "0 24px 64px hsl(240 10% 0% / 0.16)",
  glass: "0 8px 32px hsl(240 10% 0% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.50)",
  glow: "0 0 40px hsl(var(--primary) / 0.20)",
  glowLg: "0 0 80px hsl(var(--primary) / 0.12)",
};

// ═══════════════════════════════════════════════════════════════
// 动画 Token (Dark/Light 共用)
// ═══════════════════════════════════════════════════════════════

const motion: MotionTokens = {
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "800ms",
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  keyframes: {
    "gradient-flow": {
      "0%, 100%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
    },
    float: {
      "0%, 100%": { transform: "translateY(0px)" },
      "50%": { transform: "translateY(-6px)" },
    },
    shimmer: {
      "100%": { transform: "translateX(100%)" },
    },
    "fade-in": {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
    "slide-up": {
      "0%": { opacity: "0", transform: "translateY(10px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "scale-in": {
      "0%": { opacity: "0", transform: "scale(0.95)" },
      "100%": { opacity: "1", transform: "scale(1)" },
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// 渐变 Token
// ═══════════════════════════════════════════════════════════════

const darkGradient: GradientTokens = {
  brand: "linear-gradient(135deg, hsl(258 90% 66%), hsl(239 84% 67%), hsl(189 94% 43%))",
  brandSoft: "linear-gradient(135deg, hsl(258 90% 66% / 0.15), hsl(239 84% 67% / 0.10), hsl(189 94% 43% / 0.05))",
  text: "linear-gradient(135deg, hsl(258 90% 80%), hsl(239 84% 73%), hsl(189 94% 71%))",
};

const lightGradient: GradientTokens = {
  brand: "linear-gradient(135deg, hsl(258 90% 66%), hsl(239 84% 67%), hsl(189 94% 43%))",
  brandSoft: "linear-gradient(135deg, hsl(258 90% 66% / 0.10), hsl(239 84% 67% / 0.08), hsl(189 94% 43% / 0.05))",
  text: "linear-gradient(135deg, hsl(258 90% 55%), hsl(239 84% 55%), hsl(189 94% 40%))",
};

// ═══════════════════════════════════════════════════════════════
// 完整主题组装
// ═══════════════════════════════════════════════════════════════

export const darkThemeTokens: ThemeTokens = {
  colors: darkColors,
  typography,
  spacing,
  radius,
  shadow: darkShadow,
  motion,
  gradient: darkGradient,
};

export const lightThemeTokens: ThemeTokens = {
  colors: lightColors,
  typography,
  spacing,
  radius,
  shadow: lightShadow,
  motion,
  gradient: lightGradient,
};

// ═══════════════════════════════════════════════════════════════
// 主题预设
// ═══════════════════════════════════════════════════════════════

export const defaultThemePreset = {
  id: "nova-default",
  name: "Nova Default",
  description: "Default dark-first theme with glassmorphism aesthetics",
  dark: darkThemeTokens,
  light: lightThemeTokens,
};
