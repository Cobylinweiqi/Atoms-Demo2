"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";

// ═══════════════════════════════════════════════════════════════
// GitPanel — Git 同步面板
// 展示: 仓库连接 / 分支信息 / 同步记录 / Push/Pull
// ═══════════════════════════════════════════════════════════════

export function GitPanel() {
  const gitConnection = useWorkspaceStore((s) => s.gitConnection);
  const gitSyncs = useWorkspaceStore((s) => s.gitSyncs);
  const syncGit = useWorkspaceStore((s) => s.syncGit);

  if (!gitConnection) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/[0.1] py-16">
          <LucideIcons.Github size={36} className="text-muted-foreground/30" />
          <div className="text-sm text-muted-foreground/50">No Git repository connected</div>
          <button className="rounded-lg bg-foreground/5 px-4 py-1.5 text-xs text-foreground hover:bg-foreground/10">
            Connect GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* ─── 仓库信息 ─── */}
      <div className="glass mb-4 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5">
            <LucideIcons.Github size={24} className="text-foreground/60" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-foreground">{gitConnection.repoFullName}</h2>
            <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground/50">
              <span className="flex items-center gap-1">
                <LucideIcons.GitBranch size={11} />
                {gitConnection.defaultBranch}
              </span>
              <span className="flex items-center gap-1">
                <LucideIcons.Link size={11} />
                {gitConnection.provider}
              </span>
              <span className="flex items-center gap-1 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* 同步操作 */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => syncGit("push")}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white shadow-glow"
          >
            <LucideIcons.Upload size={12} />
            Push
          </button>
          <button
            onClick={() => syncGit("pull")}
            className="flex items-center gap-1.5 rounded-lg bg-foreground/5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-foreground/10"
          >
            <LucideIcons.Download size={12} />
            Pull
          </button>
        </div>
      </div>

      {/* ─── 同步记录 ─── */}
      <h3 className="mb-2 text-sm font-semibold text-foreground">Sync History</h3>
      <div className="flex flex-col gap-1">
        {gitSyncs.map((sync) => (
          <div key={sync.id} className="flex items-center gap-3 rounded-xl border border-border/[0.04] bg-foreground/[0.01] p-3 hover:border-border/[0.08]">
            <SyncDirectionIcon direction={sync.direction} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground capitalize">{sync.direction}</span>
                <SyncStatusBadge status={sync.status} />
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                {sync.commitHash && <span className="font-mono">{sync.commitHash}</span>}
                {sync.commitMessage && <span className="truncate">{sync.commitMessage}</span>}
                <span className="flex items-center gap-0.5">
                  <LucideIcons.GitBranch size={9} />
                  {sync.branch}
                </span>
              </div>
            </div>
            <div className="text-right text-[10px] text-muted-foreground/40">
              {formatTime(sync.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SyncDirectionIcon({ direction }: { direction: "push" | "pull" }) {
  const Icon = direction === "push" ? LucideIcons.Upload : LucideIcons.Download;
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground/5">
      <Icon size={13} className="text-primary/60" />
    </div>
  );
}

function SyncStatusBadge({ status }: { status: string }) {
  const cls = {
    pending: "bg-muted-foreground/10 text-muted-foreground",
    syncing: "bg-warning/10 text-warning animate-pulse",
    synced: "bg-success/10 text-success",
    failed: "bg-destructive/10 text-destructive",
  }[status] ?? "bg-muted-foreground/10 text-muted-foreground";
  return <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-medium uppercase", cls)}>{status}</span>;
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
