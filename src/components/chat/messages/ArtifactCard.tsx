"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// ArtifactCard — AI 生成的代码产物卡片
// 支持: 预览/代码切换 / 复制 / 下载 / 在预览面板打开
// ═══════════════════════════════════════════════════════════════

type ArtifactKind = "application" | "code" | "html" | "svg" | "react";

interface ArtifactCardProps {
  title: string;
  typeKind: ArtifactKind;
  language?: string;
  content: string;
  filename?: string;
  className?: string;
}

export function ArtifactCard({
  title,
  typeKind,
  language,
  content,
  filename,
  className,
}: ArtifactCardProps) {
  const [view, setView] = useState<"preview" | "code">(
    typeKind === "html" || typeKind === "svg" ? "preview" : "code"
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `${title.toLowerCase().replace(/\s+/g, "-")}.${getFileExtension(typeKind, language)}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canPreview = typeKind === "html" || typeKind === "svg";

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/[0.06] bg-surface-1", className)}>
      {/* ─── 头部 ─── */}
      <div className="flex items-center justify-between border-b border-border/[0.04] bg-foreground/[0.01] px-3 py-2">
        <div className="flex items-center gap-2">
          {/* 类型图标 */}
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-brand-soft">
            <ArtifactIcon kind={typeKind} />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{title}</p>
            <p className="text-[10px] text-muted-foreground/60">
              {filename || `${typeKind}${language ? ` · ${language}` : ""}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* 视图切换 */}
          {canPreview && (
            <div className="flex items-center gap-0.5 rounded-lg bg-foreground/[0.03] p-0.5">
              <button
                onClick={() => setView("preview")}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
                  view === "preview" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Preview
              </button>
              <button
                onClick={() => setView("code")}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
                  view === "code" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Code
              </button>
            </div>
          )}

          {/* 复制 */}
          <button
            onClick={handleCopy}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            title="Copy"
          >
            {copied ? <LucideIcons.Check size={12} className="text-success" /> : <LucideIcons.Copy size={12} />}
          </button>

          {/* 下载 */}
          <button
            onClick={handleDownload}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            title="Download"
          >
            <LucideIcons.Download size={12} />
          </button>
        </div>
      </div>

      {/* ─── 内容 ─── */}
      <div className="max-h-[400px] overflow-auto">
        {view === "preview" && canPreview ? (
          <ArtifactPreview kind={typeKind} content={content} />
        ) : (
          <pre className="p-3">
            <code className="font-mono text-[12px] leading-[1.65] text-foreground/90 whitespace-pre">
              {content}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ArtifactIcon — 类型图标
// ═══════════════════════════════════════════════════════════════

function ArtifactIcon({ kind }: { kind: ArtifactKind }) {
  const icons: Record<ArtifactKind, { icon: string; color: string }> = {
    application: { icon: "AppWindow", color: "text-primary" },
    code: { icon: "Code2", color: "text-accent" },
    html: { icon: "Globe", color: "text-warning" },
    svg: { icon: "Image", color: "text-secondary" },
    react: { icon: "Atom", color: "text-accent" },
  };
  const config = icons[kind];
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[config.icon] ?? LucideIcons.Box;

  return <Icon size={12} className={config.color} />;
}

// ═══════════════════════════════════════════════════════════════
// ArtifactPreview — 内联预览
// ═══════════════════════════════════════════════════════════════

function ArtifactPreview({ kind, content }: { kind: ArtifactKind; content: string }) {
  if (kind === "svg") {
    return (
      <div className="flex min-h-[200px] items-center justify-center bg-foreground/[0.02] p-4">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  if (kind === "html") {
    return (
      <iframe
        srcDoc={content}
        className="h-[300px] w-full border-0 bg-white"
        sandbox="allow-scripts"
        title="Artifact Preview"
      />
    );
  }

  return (
    <div className="p-4 text-xs text-muted-foreground">
      Preview not available for this artifact type.
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════════════════

function getFileExtension(kind: ArtifactKind, language?: string): string {
  if (language) {
    const extMap: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      jsx: "jsx",
      tsx: "tsx",
      python: "py",
      html: "html",
      css: "css",
      json: "json",
      bash: "sh",
    };
    return extMap[language.toLowerCase()] || "txt";
  }
  const kindExt: Record<ArtifactKind, string> = {
    application: "js",
    code: "txt",
    html: "html",
    svg: "svg",
    react: "tsx",
  };
  return kindExt[kind];
}
