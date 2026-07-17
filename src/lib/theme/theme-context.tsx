"use client";

// ═══════════════════════════════════════════════════════════════
// ThemeContext — 运行时主题管理
// 提供: 模式切换 / Token 编辑 / 导出导入 / 持久化
// ═══════════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useTheme as useNextTheme } from "next-themes";
import type { ThemeTokens, ThemeMode } from "./tokens/types";
import {
  darkThemeTokens,
  lightThemeTokens,
  defaultThemePreset,
} from "./tokens/defaults";
import { injectCSSVars } from "./tokens/css-generator";
import {
  exportThemeAsJSON,
  importThemeFromJSON,
  type ExportedTheme,
} from "./theme-export-import";

// 注: dark/light class 由 next-themes 管理, injectCSSVars 仅注入 CSS 变量

// ─── Context 类型 ───
interface ThemeContextValue {
  // 当前模式
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;

  // 当前 Token (当前模式对应的)
  tokens: ThemeTokens;

  // 自定义 Token (用户可编辑)
  customDarkTokens: ThemeTokens;
  customLightTokens: ThemeTokens;

  // 更新 Token
  updateTokens: (tokens: Partial<ThemeTokens>) => void;
  resetTokens: () => void;

  // 主题元数据
  themeName: string;

  // 导出 / 导入
  exportTheme: () => string;
  importTheme: (json: string) => boolean;

  // 是否已加载 (避免 SSR 闪烁)
  mounted: boolean;
}

// ─── Context ───
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Storage Keys ───
const STORAGE_KEY_DARK = "theme-tokens-dark";
const STORAGE_KEY_LIGHT = "theme-tokens-light";

// ─── 深度合并 Token ───
function deepMergeTokens(base: ThemeTokens, override: Partial<ThemeTokens>): ThemeTokens {
  return {
    colors: { ...base.colors, ...override.colors },
    typography: {
      fontFamily: { ...base.typography.fontFamily, ...override.typography?.fontFamily },
      fontSize: { ...base.typography.fontSize, ...override.typography?.fontSize },
      fontWeight: { ...base.typography.fontWeight, ...override.typography?.fontWeight },
      lineHeight: { ...base.typography.lineHeight, ...override.typography?.lineHeight },
      letterSpacing: { ...base.typography.letterSpacing, ...override.typography?.letterSpacing },
    },
    spacing: { ...base.spacing, ...override.spacing },
    radius: { ...base.radius, ...override.radius },
    shadow: { ...base.shadow, ...override.shadow },
    motion: {
      duration: { ...base.motion.duration, ...override.motion?.duration },
      easing: { ...base.motion.easing, ...override.motion?.easing },
      keyframes: { ...base.motion.keyframes, ...override.motion?.keyframes },
    },
    gradient: { ...base.gradient, ...override.gradient },
  };
}

// ─── Provider 组件 ───
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeTokenProvider({
  children,
  defaultMode = "dark",
}: ThemeProviderProps) {
  const { theme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [customDarkTokens, setCustomDarkTokens] = useState<ThemeTokens>(darkThemeTokens);
  const [customLightTokens, setCustomLightTokens] = useState<ThemeTokens>(lightThemeTokens);

  // ─── mode 来自 next-themes ───
  const mode: ThemeMode = (theme as ThemeMode) || defaultMode;

  // ─── 初始化: 从 localStorage 读取自定义 token ───
  useEffect(() => {
    try {
      // 读取自定义 dark token
      const savedDark = localStorage.getItem(STORAGE_KEY_DARK);
      if (savedDark) {
        const parsed = JSON.parse(savedDark) as Partial<ThemeTokens>;
        setCustomDarkTokens(deepMergeTokens(darkThemeTokens, parsed));
      }

      // 读取自定义 light token
      const savedLight = localStorage.getItem(STORAGE_KEY_LIGHT);
      if (savedLight) {
        const parsed = JSON.parse(savedLight) as Partial<ThemeTokens>;
        setCustomLightTokens(deepMergeTokens(lightThemeTokens, parsed));
      }
    } catch {
      // 忽略解析错误
    }
    setMounted(true);
  }, []);

  // ─── 当前模式的 Token ───
  const tokens = useMemo(
    () => (mode === "dark" ? customDarkTokens : customLightTokens),
    [mode, customDarkTokens, customLightTokens]
  );

  // ─── 注入 CSS 变量 ───
  useEffect(() => {
    if (mounted) {
      injectCSSVars(tokens, mode);
    }
  }, [tokens, mode, mounted]);

  // ─── 切换模式 (委托给 next-themes) ───
  const setMode = useCallback((newMode: ThemeMode) => {
    setTheme(newMode);
  }, [setTheme]);

  const toggleMode = useCallback(() => {
    setTheme(mode === "dark" ? "light" : "dark");
  }, [mode, setTheme]);

  // ─── 更新 Token ───
  const updateTokens = useCallback(
    (partial: Partial<ThemeTokens>) => {
      if (mode === "dark") {
        setCustomDarkTokens((prev) => {
          const merged = deepMergeTokens(prev, partial);
          localStorage.setItem(STORAGE_KEY_DARK, JSON.stringify(merged));
          return merged;
        });
      } else {
        setCustomLightTokens((prev) => {
          const merged = deepMergeTokens(prev, partial);
          localStorage.setItem(STORAGE_KEY_LIGHT, JSON.stringify(merged));
          return merged;
        });
      }
    },
    [mode]
  );

  // ─── 重置 Token ───
  const resetTokens = useCallback(() => {
    if (mode === "dark") {
      setCustomDarkTokens(darkThemeTokens);
      localStorage.removeItem(STORAGE_KEY_DARK);
    } else {
      setCustomLightTokens(lightThemeTokens);
      localStorage.removeItem(STORAGE_KEY_LIGHT);
    }
  }, [mode]);

  // ─── 导出 ───
  const exportTheme = useCallback((): string => {
    const exported: ExportedTheme = exportThemeAsJSON(
      customDarkTokens,
      customLightTokens,
      defaultThemePreset.name
    );
    return JSON.stringify(exported, null, 2);
  }, [customDarkTokens, customLightTokens]);

  // ─── 导入 ───
  const importTheme = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as ExportedTheme;
      const { dark, light } = importThemeFromJSON(parsed);
      setCustomDarkTokens(dark);
      setCustomLightTokens(light);
      localStorage.setItem(STORAGE_KEY_DARK, JSON.stringify(dark));
      localStorage.setItem(STORAGE_KEY_LIGHT, JSON.stringify(light));
      return true;
    } catch {
      return false;
    }
  }, []);

  // ─── Context 值 ───
  const value: ThemeContextValue = {
    mode,
    setMode,
    toggleMode,
    tokens,
    customDarkTokens,
    customLightTokens,
    updateTokens,
    resetTokens,
    themeName: defaultThemePreset.name,
    exportTheme,
    importTheme,
    mounted,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── useThemeToken Hook ───
export function useThemeToken(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeToken must be used within ThemeTokenProvider");
  }
  return ctx;
}
