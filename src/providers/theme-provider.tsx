"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeTokenProvider } from "@/lib/theme/theme-context";

/**
 * ThemeProvider — 全局主题 Provider
 * 组合 next-themes (class 切换) + ThemeTokenProvider (Design Token 管理)
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeTokenProvider defaultMode="dark">
        {children}
      </ThemeTokenProvider>
    </NextThemesProvider>
  );
}
