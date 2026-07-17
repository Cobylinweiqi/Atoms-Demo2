"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";

// ═══════════════════════════════════════════════════════════════
// StorageBrowser — 存储浏览器
// 展示: 存储桶列表 / 对象列表 / 上传 / 文件信息
// ═══════════════════════════════════════════════════════════════

export function StorageBrowser() {
  const storageBuckets = useWorkspaceStore((s) => s.storageBuckets);
  const storageObjects = useWorkspaceStore((s) => s.storageObjects);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const uploadStorageObject = useWorkspaceStore((s) => s.uploadStorageObject);

  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

  const envBuckets = storageBuckets.filter((b) => b.environmentId === activeEnvId);
  const bucketObjects = storageObjects.filter((o) => o.bucketId === selectedBucket);
  const selectedBucketData = envBuckets.find((b) => b.id === selectedBucket);

  const handleUpload = () => {
    if (!selectedBucket) return;
    // 模拟上传
    const fileName = `file-${Date.now()}.bin`;
    uploadStorageObject(selectedBucket, fileName, Math.floor(Math.random() * 1000000) + 10000);
  };

  return (
    <div className="flex h-full">
      {/* ─── 存储桶列表 ─── */}
      <div className="flex w-60 shrink-0 flex-col border-r border-border/[0.06]">
        <div className="border-b border-border/[0.06] px-4 py-2.5">
          <span className="text-sm font-semibold text-foreground">Buckets</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {envBuckets.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground/30">
              <LucideIcons.HardDrive size={24} />
              <span className="text-[10px]">No buckets</span>
            </div>
          ) : (
            envBuckets.map((bucket) => (
              <div
                key={bucket.id}
                onClick={() => setSelectedBucket(bucket.id)}
                className={cn(
                  "group cursor-pointer rounded-lg p-2 transition-colors hover:bg-foreground/[0.03]",
                  selectedBucket === bucket.id && "bg-foreground/[0.06]",
                )}
              >
                <div className="flex items-center gap-2">
                  <LucideIcons.Archive size={14} className="text-primary/60" />
                  <span className="truncate text-xs font-medium text-foreground">{bucket.name}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 pl-6 text-[9px] text-muted-foreground/40">
                  <span>{bucket.fileCount} files</span>
                  <span>·</span>
                  <span>{formatBytes(bucket.totalSizeBytes)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── 对象列表 ─── */}
      <div className="flex-1 overflow-y-auto">
        {selectedBucket ? (
          <div>
            {/* 桶信息 + 操作 */}
            <div className="flex items-center justify-between border-b border-border/[0.06] px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{selectedBucketData?.bucketName}</h3>
                <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                  <span className="flex items-center gap-1">
                    <LucideIcons.Cloud size={10} />
                    {selectedBucketData?.provider}
                  </span>
                  <span>{selectedBucketData?.region}</span>
                  <span>{selectedBucketData?.fileCount} files · {formatBytes(selectedBucketData?.totalSizeBytes ?? 0)}</span>
                </div>
              </div>
              <button
                onClick={handleUpload}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white shadow-glow"
              >
                <LucideIcons.Upload size={12} />
                Upload
              </button>
            </div>

            {/* 对象表格 */}
            <div className="p-4">
              {bucketObjects.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground/30">
                  <LucideIcons.FolderOpen size={28} />
                  <span className="text-xs">No objects in this bucket</span>
                </div>
              ) : (
                <div className="glass overflow-hidden rounded-xl">
                  <div className="grid grid-cols-[3fr_2fr_1fr_1fr_auto] gap-2 border-b border-border/[0.06] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                    <span>Name</span>
                    <span>Key</span>
                    <span>Size</span>
                    <span>Type</span>
                    <span></span>
                  </div>
                  {bucketObjects.map((obj) => (
                    <div key={obj.id} className="grid grid-cols-[3fr_2fr_1fr_1fr_auto] items-center gap-2 border-b border-border/[0.04] px-4 py-2 text-xs last:border-0 hover:bg-foreground/[0.02]">
                      <div className="flex items-center gap-2">
                        <FileObjectIcon contentType={obj.contentType} />
                        <span className="truncate text-foreground">{obj.fileName}</span>
                        {obj.isPublic && <LucideIcons.Globe size={10} className="text-success" />}
                      </div>
                      <span className="truncate font-mono text-muted-foreground/40">{obj.key}</span>
                      <span className="font-mono text-muted-foreground/50">{formatBytes(obj.sizeBytes)}</span>
                      <span className="truncate text-muted-foreground/40">{obj.contentType}</span>
                      <div className="flex gap-1">
                        {obj.url && (
                          <a href={obj.url} target="_blank" rel="noreferrer" className="rounded p-1 text-muted-foreground/30 hover:text-primary">
                            <LucideIcons.ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/30">
            <LucideIcons.HardDrive size={28} />
            <span className="text-xs">Select a bucket to browse</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FileObjectIcon({ contentType }: { contentType: string }) {
  const Icon = contentType.startsWith("image/") ? LucideIcons.Image
    : contentType.startsWith("video/") ? LucideIcons.Video
    : contentType.startsWith("text/css") ? LucideIcons.FileCode
    : contentType.startsWith("text/") ? LucideIcons.FileText
    : contentType.includes("json") ? LucideIcons.FileJson
    : LucideIcons.File;
  return <Icon size={13} className="shrink-0 text-muted-foreground/50" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
}
