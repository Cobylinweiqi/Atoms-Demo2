// ═══════════════════════════════════════════════════════════════
// Design Token 类型定义
// 所有主题 token 的 TypeScript 类型约束
// ═══════════════════════════════════════════════════════════════

// ─── HSL 颜色值 (H S% L%) ───
export interface HSLValue {
  h: number;
  s: number;
  l: number;
  a?: number; // alpha 0-1
}

// ─── 颜色 Token ───
export interface ColorTokens {
  // 背景
  background: HSLValue;
  surface1: HSLValue;
  surface2: HSLValue;
  surface3: HSLValue;
  surface4: HSLValue;
  // 前景
  foreground: HSLValue;
  muted: HSLValue;
  mutedForeground: HSLValue;
  // 品牌
  primary: HSLValue;
  primaryForeground: HSLValue;
  secondary: HSLValue;
  secondaryForeground: HSLValue;
  accent: HSLValue;
  accentForeground: HSLValue;
  // 状态
  success: HSLValue;
  successForeground: HSLValue;
  warning: HSLValue;
  warningForeground: HSLValue;
  destructive: HSLValue;
  destructiveForeground: HSLValue;
  // 卡片/弹出层
  card: HSLValue;
  cardForeground: HSLValue;
  popover: HSLValue;
  popoverForeground: HSLValue;
  // 边框/输入/焦点
  border: HSLValue;
  input: HSLValue;
  ring: HSLValue;
}

// ─── 字体族 ───
export interface FontFamilyTokens {
  sans: string;
  display: string;
  mono: string;
}

// ─── 字号 ───
export interface FontSizeTokens {
  xs: string;      // 0.75rem
  sm: string;      // 0.875rem
  base: string;    // 1rem
  lg: string;      // 1.125rem
  xl: string;      // 1.25rem
  "2xl": string;   // 1.5rem
  "3xl": string;   // 1.875rem
  "4xl": string;   // 2.25rem
  "5xl": string;   // 3rem
  "6xl": string;   // 3.75rem
}

// ─── 字重 ───
export interface FontWeightTokens {
  thin: number;
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
  black: number;
}

// ─── 行高 ───
export interface LineHeightTokens {
  none: string;
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
}

// ─── 字间距 ───
export interface LetterSpacingTokens {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
}

// ─── 排版 Token (聚合) ───
export interface TypographyTokens {
  fontFamily: FontFamilyTokens;
  fontSize: FontSizeTokens;
  fontWeight: FontWeightTokens;
  lineHeight: LineHeightTokens;
  letterSpacing: LetterSpacingTokens;
}

// ─── 间距 Token ───
export interface SpacingTokens {
  0: string;
  px: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
  36: string;
  40: string;
  44: string;
  48: string;
  52: string;
  56: string;
  60: string;
  64: string;
  72: string;
  80: string;
  96: string;
}

// ─── 圆角 Token ───
export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  full: string;
}

// ─── 阴影 Token ───
export interface ShadowTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  glass: string;
  glow: string;
  glowLg: string;
}

// ─── 动画时长 Token ───
export interface DurationTokens {
  instant: string;
  fast: string;
  normal: string;
  slow: string;
  slower: string;
}

// ─── 缓动函数 Token ───
export interface EasingTokens {
  standard: string;
  in: string;
  out: string;
  inOut: string;
  spring: string;
}

// ─── 关键帧定义 ───
export interface KeyframeTokens {
  [name: string]: {
    [step: string]: Record<string, string>;
  };
}

// ─── 动画 Token (聚合) ───
export interface MotionTokens {
  duration: DurationTokens;
  easing: EasingTokens;
  keyframes: KeyframeTokens;
}

// ─── 背景渐变 Token ───
export interface GradientTokens {
  brand: string;
  brandSoft: string;
  text: string;
}

// ─── 完整主题 Token ───
export interface ThemeTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  motion: MotionTokens;
  gradient: GradientTokens;
}

// ─── 主题模式 ───
export type ThemeMode = "dark" | "light";

// ─── 完整主题 (含元数据) ───
export interface Theme {
  id: string;
  name: string;
  mode: ThemeMode;
  tokens: ThemeTokens;
  createdAt: number;
  updatedAt: number;
}

// ─── 主题预设 ───
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  dark: ThemeTokens;
  light: ThemeTokens;
}
