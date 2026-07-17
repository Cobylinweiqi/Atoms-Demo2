"use client";

// ═══════════════════════════════════════════════════════════════
// ThemeEditor — 可视化主题编辑器
// 支持: 颜色编辑 / 模式切换 / 导出导入 / 重置
// ═══════════════════════════════════════════════════════════════

import React, { useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeToken } from "@/lib/theme/theme-context";
import { downloadThemeFile, exportThemeAsJSON } from "@/lib/theme/theme-export-import";
import type { HSLValue, ColorTokens } from "@/lib/theme/tokens/types";

// ═══════════════════════════════════════════════════════════════
// 颜色 token key → 显示名映射
// ═══════════════════════════════════════════════════════════════

const COLOR_GROUPS: { label: string; keys: { key: keyof ColorTokens; label: string }[] }[] = [
  {
    label: "Backgrounds",
    keys: [
      { key: "background", label: "Background" },
      { key: "surface1", label: "Surface 1" },
      { key: "surface2", label: "Surface 2" },
      { key: "surface3", label: "Surface 3" },
      { key: "surface4", label: "Surface 4" },
    ],
  },
  {
    label: "Text",
    keys: [
      { key: "foreground", label: "Foreground" },
      { key: "mutedForeground", label: "Muted Foreground" },
    ],
  },
  {
    label: "Brand",
    keys: [
      { key: "primary", label: "Primary" },
      { key: "secondary", label: "Secondary" },
      { key: "accent", label: "Accent" },
    ],
  },
  {
    label: "Status",
    keys: [
      { key: "success", label: "Success" },
      { key: "warning", label: "Warning" },
      { key: "destructive", label: "Destructive" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// ThemeEditor 主组件
// ═══════════════════════════════════════════════════════════════

export function ThemeEditor() {
  const {
    mode,
    toggleMode,
    tokens,
    updateTokens,
    resetTokens,
    exportTheme,
    importTheme,
    themeName,
  } = useThemeToken();

  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importError, setImportError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── 更新单个颜色 ───
  const handleColorChange = (key: keyof ColorTokens, value: HSLValue) => {
    updateTokens({
      colors: { ...tokens.colors, [key]: value } as ColorTokens,
    });
  };

  // ─── 导出 ───
  const handleExport = () => {
    const text = exportTheme();
    setExportText(text);
    setShowExport(true);
  };

  // ─── 下载文件 ───
  const handleDownload = () => {
    const dark = JSON.parse(exportTheme()).dark;
    const light = JSON.parse(exportTheme()).light;
    const exported = exportThemeAsJSON(dark, light, themeName);
    downloadThemeFile(exported);
  };

  // ─── 导入 ───
  const handleImport = () => {
    const success = importTheme(importText);
    if (success) {
      setShowImport(false);
      setImportText("");
      setImportError(false);
    } else {
      setImportError(true);
    }
  };

  // ─── 文件上传导入 ───
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
      setShowImport(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* ─── Header ─── */}
      <header className="glass-nav flex h-12 shrink-0 items-center justify-between border-b border-border/[0.06] px-4">
        <div className="flex items-center gap-2">
          <LucideIcons.Palette size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Theme Editor</span>
        </div>

        <div className="flex items-center gap-1">
          {/* 模式切换 */}
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 rounded-lg bg-surface-3 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {mode === "dark" ? <LucideIcons.Moon size={12} /> : <LucideIcons.Sun size={12} />}
            {mode === "dark" ? "Dark" : "Light"}
          </button>

          {/* 导入 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
            title="Import"
          >
            <LucideIcons.Upload size={13} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* 导出 */}
          <button
            onClick={handleExport}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
            title="Export"
          >
            <LucideIcons.Download size={13} />
          </button>

          {/* 重置 */}
          <button
            onClick={resetTokens}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground"
            title="Reset"
          >
            <LucideIcons.RotateCcw size={13} />
          </button>
        </div>
      </header>

      {/* ─── 颜色编辑区 ─── */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl space-y-6">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
                {group.label}
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {group.keys.map(({ key, label }) => (
                  <ColorRow
                    key={key}
                    label={label}
                    value={tokens.colors[key]}
                    onChange={(v) => handleColorChange(key, v)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* ─── 圆角 ─── */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
              Radius
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(tokens.radius).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-lg border border-border/[0.06] bg-surface-1 px-2.5 py-1.5"
                >
                  <div
                    className="h-5 w-5 shrink-0 border border-border/[0.10]"
                    style={{ borderRadius: value }}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-foreground">{key}</p>
                    <p className="text-[9px] text-muted-foreground/60 font-mono">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── 阴影 ─── */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
              Shadow
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {Object.entries(tokens.shadow).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg bg-surface-1 p-3"
                  style={{ boxShadow: value }}
                >
                  <p className="text-[10px] font-medium text-foreground">{key}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── 动画 ─── */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
              Motion — Duration
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {Object.entries(tokens.motion.duration).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-border/[0.06] bg-surface-1 px-2.5 py-1.5"
                >
                  <p className="text-[10px] font-medium text-foreground">{key}</p>
                  <p className="text-[9px] text-muted-foreground/60 font-mono">{value}</p>
                </div>
              ))}
            </div>

            <h3 className="mb-3 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
              Motion — Easing
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {Object.entries(tokens.motion.easing).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-border/[0.06] bg-surface-1 px-2.5 py-1.5"
                >
                  <p className="text-[10px] font-medium text-foreground">{key}</p>
                  <p className="text-[9px] text-muted-foreground/60 font-mono truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── 渐变 ─── */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
              Gradient
            </h3>
            <div className="space-y-2">
              {Object.entries(tokens.gradient).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="h-8 w-16 shrink-0 rounded-lg"
                    style={{ background: value }}
                  />
                  <span className="text-xs text-muted-foreground">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 导出弹窗 ─── */}
      {showExport && (
        <Modal title="Export Theme" onClose={() => setShowExport(false)}>
          <div className="space-y-3">
            <textarea
              readOnly
              value={exportText}
              className="h-64 w-full resize-none rounded-lg border border-border/[0.06] bg-surface-1 p-3 font-mono text-[11px] text-foreground/80"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(exportText)}
                className="flex items-center gap-1.5 rounded-lg bg-surface-3 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-4"
              >
                <LucideIcons.Copy size={12} />
                Copy
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <LucideIcons.Download size={12} />
                Download
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── 导入弹窗 ─── */}
      {showImport && (
        <Modal title="Import Theme" onClose={() => { setShowImport(false); setImportError(false); }}>
          <div className="space-y-3">
            <textarea
              value={importText}
              onChange={(e) => { setImportText(e.target.value); setImportError(false); }}
              placeholder="Paste theme JSON here..."
              className="h-64 w-full resize-none rounded-lg border border-border/[0.06] bg-surface-1 p-3 font-mono text-[11px] text-foreground/80"
            />
            {importError && (
              <p className="text-xs text-destructive">Invalid theme JSON. Please check the format.</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowImport(false); setImportError(false); }}
                className="rounded-lg bg-surface-3 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-4"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Import
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ColorRow — 单个颜色编辑行
// ═══════════════════════════════════════════════════════════════

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: HSLValue;
  onChange: (value: HSLValue) => void;
}) {
  const colorHex = hslToHex(value);

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/[0.06] bg-surface-1 px-3 py-2">
      {/* 颜色预览 + 输入 */}
      <div className="relative">
        <div
          className="h-8 w-8 shrink-0 rounded-lg border border-border/[0.10]"
          style={{ backgroundColor: `hsl(${value.h} ${value.s}% ${value.l}%)` }}
        />
        <input
          type="color"
          value={colorHex}
          onChange={(e) => onChange(hexToHSL(e.target.value))}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>

      {/* 标签 + HSL 值 */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground/60 font-mono truncate">
          {value.h} {value.s}% {value.l}%
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Modal — 弹窗
// ═══════════════════════════════════════════════════════════════

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border/[0.06] bg-surface-2 p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-3 hover:text-foreground"
          >
            <LucideIcons.X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 颜色转换工具
// ═══════════════════════════════════════════════════════════════

function hslToHex(hsl: HSLValue): string {
  const { h, s, l } = hsl;
  const lNorm = l / 100;
  const a = (s * Math.min(lNorm, 1 - lNorm)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHSL(hex: string): HSLValue {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
