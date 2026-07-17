"use client";

import React, { useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// FileUpload — 文件附件组件
// 两种模式: 展示模式(已上传) / 上传模式(可拖拽上传)
// ═══════════════════════════════════════════════════════════════

interface FileUploadProps {
  filename?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  content?: string;
  className?: string;
}

export function FileUpload({
  filename,
  mimeType,
  size,
  url,
  className,
}: FileUploadProps) {
  if (filename) {
    return (
      <FileDisplay
        filename={filename}
        mimeType={mimeType || "application/octet-stream"}
        size={size || 0}
        url={url}
        className={className}
      />
    );
  }

  return <FileUploader className={className} />;
}

// ═══════════════════════════════════════════════════════════════
// FileDisplay — 文件展示
// ═══════════════════════════════════════════════════════════════

function FileDisplay({
  filename,
  mimeType,
  size,
  url,
  className,
}: {
  filename: string;
  mimeType: string;
  size: number;
  url?: string;
  className?: string;
}) {
  const { icon, color } = getFileIcon(filename, mimeType);
  const Icon =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon] ??
    LucideIcons.File;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border/[0.06] bg-foreground/[0.02] px-3 py-2.5",
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.04]">
        <Icon size={18} className={color} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground">{filename}</p>
        <p className="text-[10px] text-muted-foreground/50">
          {mimeType} · {formatFileSize(size)}
        </p>
      </div>
      {url && (
        <a
          href={url}
          download={filename}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
          title="Download"
        >
          <LucideIcons.Download size={13} />
        </a>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FileUploader — 拖拽上传
// ═══════════════════════════════════════════════════════════════

function FileUploader({ className }: { className?: string }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = e.target.files;
      if (fileList) {
        setFiles((prev) => [...prev, ...Array.from(fileList)]);
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-6 cursor-pointer transition-colors",
          isDragging
            ? "border-primary/40 bg-primary/5"
            : "border-border/[0.08] bg-foreground/[0.01] hover:border-border/[0.12] hover:bg-foreground/[0.02]"
        )}
      >
        <LucideIcons.UploadCloud size={20} className="mb-2 text-muted-foreground/50" />
        <p className="text-xs text-muted-foreground">
          Drag & drop files or <span className="text-primary">browse</span>
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground/40">
          Images, documents, code files up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      {/* 已选文件列表 */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, i) => {
            const { icon, color } = getFileIcon(file.name, file.type);
            const Icon =
              (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon] ??
              LucideIcons.File;
            return (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-border/[0.06] bg-foreground/[0.02] px-2.5 py-1.5"
              >
                <Icon size={13} className={color} />
                <span className="flex-1 truncate text-xs text-foreground">{file.name}</span>
                <span className="text-[10px] text-muted-foreground/50">{formatFileSize(file.size)}</span>
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground/40 transition-colors hover:text-destructive"
                >
                  <LucideIcons.X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════════════════

function getFileIcon(filename: string, mimeType: string): { icon: string; color: string } {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  // 图片
  if (mimeType.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) {
    return { icon: "Image", color: "text-secondary" };
  }
  // 代码
  if (["js", "jsx", "ts", "tsx", "py", "go", "rs", "java", "c", "cpp"].includes(ext)) {
    return { icon: "FileCode", color: "text-accent" };
  }
  // JSON
  if (ext === "json") {
    return { icon: "Braces", color: "text-warning" };
  }
  // 文档
  if (["md", "txt", "pdf", "doc", "docx"].includes(ext)) {
    return { icon: "FileText", color: "text-primary" };
  }
  // 压缩
  if (["zip", "tar", "gz", "rar"].includes(ext)) {
    return { icon: "FileArchive", color: "text-warning" };
  }
  return { icon: "File", color: "text-muted-foreground" };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
