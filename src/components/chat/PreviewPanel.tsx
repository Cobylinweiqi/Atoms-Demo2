"use client";

import React, { useState, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// PreviewPanel — 右侧预览面板
// 支持: Web 预览 / 代码查看 / 构建日志
// ═══════════════════════════════════════════════════════════════

type PreviewTab = "preview" | "code" | "console";
type PreviewDevice = "desktop" | "tablet" | "mobile";

interface PreviewPanelProps {
  /** 预览 URL (iframe src) */
  previewUrl?: string;
  /** HTML 内容 (直接渲染) */
  htmlContent?: string;
  /** 构建状态 */
  buildStatus?: "idle" | "building" | "ready" | "error";
  /** 构建日志 */
  consoleLogs?: ConsoleLog[];
  className?: string;
}

export interface ConsoleLog {
  level: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: number;
}

export function PreviewPanel({
  previewUrl,
  htmlContent,
  buildStatus = "ready",
  consoleLogs = [],
  className,
}: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className={cn("flex h-full flex-col bg-surface-1", className)}>
      {/* ─── Header ─── */}
      <div className="glass-nav flex h-12 shrink-0 items-center justify-between border-b border-border/[0.06] px-4">
        <div className="flex items-center gap-2">
          <LucideIcons.Eye size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Preview</span>
          <BuildStatusBadge status={buildStatus} />
        </div>

        {/* 刷新按钮 */}
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
          title="Refresh"
        >
          <LucideIcons.RefreshCw size={13} />
        </button>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border/[0.06] px-2 py-1.5">
        <TabButton active={activeTab === "preview"} onClick={() => setActiveTab("preview")} icon="Monitor" label="Preview" />
        <TabButton active={activeTab === "code"} onClick={() => setActiveTab("code")} icon="Code2" label="Code" />
        <TabButton active={activeTab === "console"} onClick={() => setActiveTab("console")} icon="Terminal" label="Console" />
        {consoleLogs.length > 0 && activeTab !== "console" && (
          <span className="ml-auto rounded-full bg-warning/15 px-1.5 py-0.5 text-[9px] font-medium text-warning">
            {consoleLogs.length}
          </span>
        )}
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "preview" && (
          <PreviewContent
            previewUrl={previewUrl}
            htmlContent={htmlContent}
            device={device}
            refreshKey={refreshKey}
            onDeviceChange={setDevice}
          />
        )}
        {activeTab === "code" && <CodeContent />}
        {activeTab === "console" && <ConsoleContent logs={consoleLogs} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BuildStatusBadge — 构建状态徽章
// ═══════════════════════════════════════════════════════════════

function BuildStatusBadge({ status }: { status: NonNullable<PreviewPanelProps["buildStatus"]> }) {
  const config: Record<string, { color: string; bg: string; icon: string; label: string; spin?: boolean }> = {
    idle: { color: "text-muted-foreground", bg: "bg-foreground/[0.04]", icon: "Circle", label: "Idle" },
    building: { color: "text-warning", bg: "bg-warning/10", icon: "Loader", label: "Building", spin: true },
    ready: { color: "text-success", bg: "bg-success/10", icon: "CheckCircle2", label: "Ready" },
    error: { color: "text-destructive", bg: "bg-destructive/10", icon: "XCircle", label: "Error" },
  };
  const cfg = config[status];
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[cfg.icon];

  return (
    <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", cfg.color, cfg.bg)}>
      {Icon && <Icon size={10} className={cn(cfg.spin && "animate-spin")} />}
      {cfg.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// TabButton — 标签按钮
// ═══════════════════════════════════════════════════════════════

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon];
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
      )}
    >
      {Icon && <Icon size={12} />}
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// PreviewContent — 预览内容 (iframe)
// ═══════════════════════════════════════════════════════════════

const DEVICE_SIZES: Record<PreviewDevice, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet" },
  mobile: { width: "375px", label: "Mobile" },
};

function PreviewContent({
  previewUrl,
  htmlContent,
  device,
  refreshKey,
  onDeviceChange,
}: {
  previewUrl?: string;
  htmlContent?: string;
  device: PreviewDevice;
  refreshKey: number;
  onDeviceChange: (d: PreviewDevice) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const size = DEVICE_SIZES[device];

  // ─── 注入 HTML 内容到 iframe ───
  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [htmlContent, refreshKey]);

  if (!previewUrl && !htmlContent) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.03] border border-border/[0.06] mb-3">
          <LucideIcons.Monitor size={22} className="text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground">No preview yet</p>
        <p className="mt-1 text-xs text-muted-foreground/50">
          Start a conversation to see live preview
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* 设备切换栏 */}
      <div className="flex shrink-0 items-center justify-center gap-1 border-b border-border/[0.06] bg-foreground/[0.01] py-1.5">
        {(Object.keys(DEVICE_SIZES) as PreviewDevice[]).map((d) => {
          const icons: Record<PreviewDevice, string> = { desktop: "Monitor", tablet: "Tablet", mobile: "Smartphone" };
          const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icons[d]];
          return (
            <button
              key={d}
              onClick={() => onDeviceChange(d)}
              className={cn(
                "flex items-center justify-center w-7 h-6 rounded-md transition-colors",
                device === d
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
              )}
              title={DEVICE_SIZES[d].label}
            >
              {Icon && <Icon size={12} />}
            </button>
          );
        })}
      </div>

      {/* iframe 预览 */}
      <div className="flex-1 overflow-auto bg-background dot-grid p-3">
        <div
          className="mx-auto h-full rounded-xl overflow-hidden border border-border/[0.06] shadow-2xl bg-white transition-all duration-300"
          style={{ maxWidth: size.width }}
        >
          <iframe
            ref={iframeRef}
            src={previewUrl}
            key={refreshKey}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CodeContent — 代码查看 (占位)
// ═══════════════════════════════════════════════════════════════

function CodeContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <LucideIcons.Code2 size={22} className="mb-2 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">Code view</p>
      <p className="mt-1 text-xs text-muted-foreground/50">
        Generated code will appear here
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ConsoleContent — 控制台日志
// ═══════════════════════════════════════════════════════════════

function ConsoleContent({ logs }: { logs: ConsoleLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <LucideIcons.Terminal size={22} className="mb-2 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No logs</p>
      </div>
    );
  }

  const levelConfig = {
    log: { color: "text-foreground", icon: "ChevronRight" },
    error: { color: "text-destructive", icon: "X" },
    warn: { color: "text-warning", icon: "AlertTriangle" },
    info: { color: "text-primary", icon: "Info" },
  };

  return (
    <div className="h-full overflow-y-auto bg-background p-2 font-mono">
      {logs.map((log, i) => {
        const cfg = levelConfig[log.level];
        const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[cfg.icon];
        return (
          <div
            key={i}
            className="flex items-start gap-2 rounded px-2 py-1 text-xs hover:bg-foreground/[0.02]"
          >
            {Icon && <Icon size={11} className={cn("mt-0.5 shrink-0", cfg.color)} />}
            <span className={cn("flex-1 break-all", cfg.color)}>{log.message}</span>
            <span className="shrink-0 text-muted-foreground/40">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
