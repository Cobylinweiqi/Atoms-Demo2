"use client";

// ═══════════════════════════════════════════════════════════════
// Theme System 测试页面
// 展示所有 Design Token 的效果 + Theme Editor
// ═══════════════════════════════════════════════════════════════

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeEditor } from "@/components/theme/ThemeEditor";
import { useThemeToken } from "@/lib/theme/theme-context";

export default function ThemePage() {
  const { mode, toggleMode, tokens, mounted } = useThemeToken();

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LucideIcons.Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ─── 左侧: Token 展示 ─── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Theme System
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Design Token driven theming with Dark/Light support
              </p>
            </div>
            <button
              onClick={toggleMode}
              className="flex items-center gap-2 rounded-xl bg-surface-3 px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-4"
            >
              {mode === "dark" ? <LucideIcons.Moon size={16} /> : <LucideIcons.Sun size={16} />}
              {mode === "dark" ? "Dark" : "Light"}
            </button>
          </div>

          {/* ─── Colors ─── */}
          <Section title="Colors" icon="Palette">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ColorSwatch name="Background" varName="--background" />
              <ColorSwatch name="Surface 1" varName="--surface-1" />
              <ColorSwatch name="Surface 2" varName="--surface-2" />
              <ColorSwatch name="Surface 3" varName="--surface-3" />
              <ColorSwatch name="Foreground" varName="--foreground" />
              <ColorSwatch name="Muted FG" varName="--muted-foreground" />
              <ColorSwatch name="Primary" varName="--primary" />
              <ColorSwatch name="Secondary" varName="--secondary" />
              <ColorSwatch name="Accent" varName="--accent" />
              <ColorSwatch name="Success" varName="--success" />
              <ColorSwatch name="Warning" varName="--warning" />
              <ColorSwatch name="Destructive" varName="--destructive" />
            </div>
          </Section>

          {/* ─── Typography ─── */}
          <Section title="Typography" icon="Type">
            <div className="space-y-3 rounded-xl border border-border/[0.06] bg-surface-1 p-4">
              <p className="text-6xl font-bold text-foreground">Aa</p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">text-xs — 0.75rem</p>
                <p className="text-sm text-muted-foreground">text-sm — 0.875rem</p>
                <p className="text-base text-foreground">text-base — 1rem</p>
                <p className="text-lg text-foreground">text-lg — 1.125rem</p>
                <p className="text-xl font-semibold text-foreground">text-xl — 1.25rem</p>
                <p className="text-2xl font-bold text-foreground">text-2xl — 1.5rem</p>
                <p className="text-3xl font-bold text-foreground">text-3xl — 1.875rem</p>
                <p className="text-4xl font-bold text-foreground">text-4xl — 2.25rem</p>
              </div>
              <div className="flex flex-wrap gap-4 border-t border-border/[0.06] pt-3">
                <span className="font-thin text-foreground">Thin 100</span>
                <span className="font-light text-foreground">Light 300</span>
                <span className="font-normal text-foreground">Normal 400</span>
                <span className="font-medium text-foreground">Medium 500</span>
                <span className="font-semibold text-foreground">Semibold 600</span>
                <span className="font-bold text-foreground">Bold 700</span>
                <span className="font-extrabold text-foreground">Extrabold 800</span>
                <span className="font-black text-foreground">Black 900</span>
              </div>
            </div>
          </Section>

          {/* ─── Radius ─── */}
          <Section title="Radius" icon="Square">
            <div className="grid grid-cols-4 gap-3">
              {(Object.entries(tokens.radius) as [string, string][]).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div
                    className="h-16 w-16 border-2 border-primary bg-primary/10"
                    style={{ borderRadius: value }}
                  />
                  <span className="text-xs text-muted-foreground">{key}</span>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ─── Shadow ─── */}
          <Section title="Shadow" icon="Cloud">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(Object.entries(tokens.shadow) as [string, string][]).map(([key, value]) => (
                <div
                  key={key}
                  className="flex h-20 items-center justify-center rounded-xl bg-surface-2"
                  style={{ boxShadow: value }}
                >
                  <span className="text-xs text-foreground">{key}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ─── Motion ─── */}
          <Section title="Motion" icon="Zap">
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2">
                {(Object.entries(tokens.motion.duration) as [string, string][]).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-border/[0.06] bg-surface-1 px-2 py-1.5 text-center">
                    <p className="text-[10px] font-medium text-foreground">{key}</p>
                    <p className="text-[9px] text-muted-foreground/60 font-mono">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(Object.entries(tokens.motion.easing) as [string, string][]).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-border/[0.06] bg-surface-1 px-2 py-1.5">
                    <p className="text-[10px] font-medium text-foreground">{key}</p>
                    <p className="text-[9px] text-muted-foreground/60 font-mono truncate">{value}</p>
                  </div>
                ))}
              </div>
              {/* Animation demos */}
              <div className="flex flex-wrap gap-3 rounded-xl border border-border/[0.06] bg-surface-1 p-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-brand animate-float" />
                <div className="h-12 w-12 rounded-lg bg-primary animate-scale-in" />
                <div className="h-12 w-12 rounded-lg bg-secondary animate-fade-in" />
                <div className="h-12 w-12 rounded-lg bg-accent animate-slide-up" />
              </div>
            </div>
          </Section>

          {/* ─── Gradient ─── */}
          <Section title="Gradient" icon="Paintbrush">
            <div className="space-y-2">
              {(Object.entries(tokens.gradient) as [string, string][]).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="h-12 w-24 shrink-0 rounded-xl"
                    style={{ background: value }}
                  />
                  <div>
                    <p className="text-xs font-medium text-foreground">{key}</p>
                    <p className="text-[10px] text-muted-foreground/60 font-mono truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ─── Button Showcase ─── */}
          <Section title="Components" icon="Component">
            <div className="space-y-4 rounded-xl border border-border/[0.06] bg-surface-1 p-4">
              <div className="flex flex-wrap gap-2">
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all hover:-translate-y-0.5">
                  Primary Button
                </button>
                <button className="rounded-md glass px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/8 transition-colors">
                  Glass Button
                </button>
                <button className="rounded-md border border-border/12 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/4 transition-colors">
                  Outline Button
                </button>
                <button className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-foreground/4 hover:text-foreground transition-colors">
                  Ghost Button
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">Success Badge</span>
                <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning">Warning Badge</span>
                <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs font-medium text-destructive">Error Badge</span>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Primary Badge</span>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">Accent Badge</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-surface-1 p-3 border border-border/[0.06]">
                  <p className="text-xs text-muted-foreground">Surface 1</p>
                </div>
                <div className="rounded-lg bg-surface-2 p-3 border border-border/[0.06]">
                  <p className="text-xs text-muted-foreground">Surface 2</p>
                </div>
                <div className="rounded-lg bg-surface-3 p-3 border border-border/[0.06]">
                  <p className="text-xs text-muted-foreground">Surface 3</p>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* ─── 右侧: Theme Editor ─── */}
      <aside className="w-[400px] shrink-0 border-l border-border/[0.06]">
        <ThemeEditor />
      </aside>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Section — 区块容器
// ═══════════════════════════════════════════════════════════════

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon] ?? LucideIcons.Box;
  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground/60">
        <Icon size={14} className="text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ColorSwatch — 颜色色块
// ═══════════════════════════════════════════════════════════════

function ColorSwatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/[0.06]">
      <div
        className="h-16 w-full"
        style={{ backgroundColor: `hsl(${varName})` }}
      />
      <div className="bg-surface-1 px-2.5 py-1.5">
        <p className="text-xs font-medium text-foreground">{name}</p>
        <p className="text-[10px] text-muted-foreground/60 font-mono">{varName}</p>
      </div>
    </div>
  );
}
