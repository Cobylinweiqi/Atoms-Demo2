"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// ImageViewer — 图片查看器
// 支持: 点击放大 / 下载 / 尺寸信息
// ═══════════════════════════════════════════════════════════════

interface ImageViewerProps {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ImageViewer({ url, alt, width, height, className }: ImageViewerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* ─── 缩略图卡片 ─── */}
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border/[0.06] bg-surface-1",
          className
        )}
      >
        <button
          onClick={() => setExpanded(true)}
          className="block w-full"
        >
          <img
            src={url}
            alt={alt || "image"}
            className="max-h-[300px] w-full object-contain transition-transform group-hover:scale-[1.02]"
          />
        </button>

        {/* 悬浮工具栏 */}
        <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {/* 下载 */}
          <a
            href={url}
            download
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/50 text-white backdrop-blur-sm transition-colors hover:bg-background/70"
            title="Download"
          >
            <LucideIcons.Download size={13} />
          </a>
          {/* 放大 */}
          <button
            onClick={() => setExpanded(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/50 text-white backdrop-blur-sm transition-colors hover:bg-background/70"
            title="Expand"
          >
            <LucideIcons.Maximize2 size={13} />
          </button>
        </div>

        {/* 底部信息 */}
        <div className="flex items-center gap-2 border-t border-border/[0.04] px-3 py-1.5">
          <LucideIcons.Image size={11} className="text-muted-foreground/50" />
          <span className="text-[10px] text-muted-foreground/60 truncate">
            {alt || "Generated image"}
          </span>
          {width && height && (
            <span className="ml-auto text-[10px] text-muted-foreground/40 font-mono">
              {width}×{height}
            </span>
          )}
        </div>
      </div>

      {/* ─── 全屏查看 ─── */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          onClick={() => setExpanded(false)}
        >
          {/* 关闭按钮 */}
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-white transition-colors hover:bg-foreground/20"
            onClick={() => setExpanded(false)}
          >
            <LucideIcons.X size={20} />
          </button>

          <img
            src={url}
            alt={alt || "image"}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
