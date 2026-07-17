"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import type { FolderNode } from "../types";

// ═══════════════════════════════════════════════════════════════
// FolderTree — 文件/文件夹树
// 支持: 展开/折叠 / 新建 / 删除 / 文件预览
// ═══════════════════════════════════════════════════════════════

export function FolderTree() {
  const folders = useWorkspaceStore((s) => s.folders);
  const addFolder = useWorkspaceStore((s) => s.addFolder);
  const deleteFolder = useWorkspaceStore((s) => s.deleteFolder);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FolderNode | null>(null);

  // 构建树结构
  const rootNodes = folders.filter((f) => f.parentId === null);
  const childrenMap = new Map<string | null, FolderNode[]>();
  for (const f of folders) {
    const key = f.parentId;
    const arr = childrenMap.get(key) ?? [];
    arr.push(f);
    childrenMap.set(key, arr);
  }

  return (
    <div className="flex h-full">
      {/* ─── 文件树 ─── */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border/[0.06]">
        <div className="flex items-center justify-between border-b border-border/[0.06] px-4 py-2.5">
          <span className="text-sm font-semibold text-foreground">Files</span>
          <div className="flex gap-1">
            <button onClick={() => addFolder(null, "new-folder", "folder")} className="rounded-lg p-1 text-muted-foreground/50 hover:bg-foreground/5 hover:text-foreground" title="New Folder">
              <LucideIcons.FolderPlus size={14} />
            </button>
            <button onClick={() => addFolder(null, "new-file.tsx", "file")} className="rounded-lg p-1 text-muted-foreground/50 hover:bg-foreground/5 hover:text-foreground" title="New File">
              <LucideIcons.FilePlus size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {rootNodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              childrenMap={childrenMap}
              depth={0}
              selectedId={selectedId}
              onSelect={(n) => {
                setSelectedId(n.id);
                if (n.type === "file") setPreviewFile(n);
              }}
              onDelete={deleteFolder}
            />
          ))}
        </div>
      </div>

      {/* ─── 文件预览 ─── */}
      <div className="flex-1 overflow-y-auto">
        {previewFile ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-border/[0.06] px-4 py-2.5">
              <FileIcon fileType={previewFile.fileType} />
              <span className="text-sm font-medium text-foreground">{previewFile.name}</span>
              <span className="text-[10px] text-muted-foreground/40">{formatSize(previewFile.size)}</span>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed">
              <code className="font-mono text-foreground/80">
                {previewFile.content ?? "(empty file)"}
              </code>
            </pre>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/30">
            <LucideIcons.FileText size={32} />
            <span className="text-xs">Select a file to preview</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TreeNode — 递归树节点
// ═══════════════════════════════════════════════════════════════

function TreeNode({
  node,
  childrenMap,
  depth,
  selectedId,
  onSelect,
  onDelete,
}: {
  node: FolderNode;
  childrenMap: Map<string | null, FolderNode[]>;
  depth: number;
  selectedId: string | null;
  onSelect: (node: FolderNode) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const children = childrenMap.get(node.id) ?? [];
  const isFolder = node.type === "folder";
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-lg py-1 pr-1 text-xs transition-colors hover:bg-foreground/[0.03]",
          isSelected && "bg-foreground/[0.06]",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* 展开/折叠 */}
        {isFolder ? (
          <button onClick={() => setExpanded((v) => !v)} className="shrink-0 text-muted-foreground/40">
            <LucideIcons.ChevronDown size={12} className={cn("transition-transform", !expanded && "-rotate-90")} />
          </button>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {/* 图标 */}
        <button onClick={() => onSelect(node)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left">
          {isFolder ? (
            <LucideIcons.Folder size={13} className={cn("shrink-0", expanded ? "text-primary/60" : "text-muted-foreground/40")} />
          ) : (
            <FileIcon fileType={node.fileType} />
          )}
          <span className={cn("truncate", isSelected ? "text-foreground" : "text-muted-foreground/70")}>
            {node.name}
          </span>
        </button>

        {/* 删除按钮 (hover 时显示) */}
        <button
          onClick={() => onDelete(node.id)}
          className="shrink-0 rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        >
          <LucideIcons.Trash2 size={11} />
        </button>
      </div>

      {/* 子节点 */}
      {isFolder && expanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              childrenMap={childrenMap}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 文件图标 ───
function FileIcon({ fileType }: { fileType?: string }) {
  const Icon = fileType === "md" ? LucideIcons.FileText
    : fileType === "json" ? LucideIcons.FileJson
    : fileType === "css" ? LucideIcons.FileCode
    : fileType === "tsx" || fileType === "ts" || fileType === "jsx" || fileType === "js"
      ? LucideIcons.FileCode
      : LucideIcons.File;
  return <Icon size={13} className="shrink-0 text-muted-foreground/50" />;
}

// ─── 格式化文件大小 ───
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
