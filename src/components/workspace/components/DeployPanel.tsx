"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import type { DeployStatus } from "../types";

// ═══════════════════════════════════════════════════════════════
// DeployPanel — 部署面板
// 展示: 当前环境部署状态 / 部署历史 / 一键部署
// ═══════════════════════════════════════════════════════════════

export function DeployPanel() {
  const deployments = useWorkspaceStore((s) => s.deployments);
  const environments = useWorkspaceStore((s) => s.environments);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const createDeployment = useWorkspaceStore((s) => s.createDeployment);

  const envDeployments = deployments.filter((d) => d.environmentId === activeEnvId);
  const latestDeploy = envDeployments[0];
  const activeEnv = environments.find((e) => e.id === activeEnvId);

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* ─── 部署操作 ─── */}
      <div className="glass mb-4 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Deploy to {activeEnv?.name}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground/50">
              {activeEnv?.url ?? "No URL configured"}
            </p>
          </div>
          <button
            onClick={() => createDeployment(activeEnvId!, "vercel")}
            disabled={!activeEnvId}
            className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-40"
          >
            <LucideIcons.Rocket size={15} />
            Deploy Now
          </button>
        </div>

        {/* 最新部署状态 */}
        {latestDeploy && (
          <div className="mt-4 flex items-center gap-4 rounded-xl border border-border/[0.06] bg-foreground/[0.02] p-3">
            <DeployStatusIcon status={latestDeploy.status} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Deployment #{latestDeploy.id.slice(-6)}</span>
                <DeployStatusBadge status={latestDeploy.status} />
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                {latestDeploy.commitHash && (
                  <span className="flex items-center gap-1 font-mono">
                    <LucideIcons.GitCommit size={10} />
                    {latestDeploy.commitHash}
                  </span>
                )}
                {latestDeploy.commitMessage && <span className="truncate">{latestDeploy.commitMessage}</span>}
                {latestDeploy.buildDurationMs && <span>{(latestDeploy.buildDurationMs / 1000).toFixed(1)}s</span>}
              </div>
            </div>
            {latestDeploy.url && latestDeploy.status === "live" && (
              <a href={latestDeploy.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1 text-xs text-success hover:bg-success/20">
                <LucideIcons.ExternalLink size={11} />
                Visit
              </a>
            )}
          </div>
        )}
      </div>

      {/* ─── 部署历史 ─── */}
      <h3 className="mb-2 text-sm font-semibold text-foreground">Deployment History</h3>
      <div className="flex flex-col gap-1">
        {envDeployments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground/30">
            <LucideIcons.PackageOpen size={28} />
            <span className="text-xs">No deployments yet</span>
          </div>
        ) : (
          envDeployments.map((deploy) => (
            <div key={deploy.id} className="group flex items-center gap-3 rounded-xl border border-border/[0.04] bg-foreground/[0.01] p-3 hover:border-border/[0.08]">
              <DeployStatusIcon status={deploy.status} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-foreground">#{deploy.id.slice(-6)}</span>
                  <DeployStatusBadge status={deploy.status} />
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                  {deploy.commitHash && <span className="font-mono">{deploy.commitHash}</span>}
                  {deploy.commitMessage && <span className="truncate">{deploy.commitMessage}</span>}
                </div>
              </div>
              <div className="text-right text-[10px] text-muted-foreground/40">
                <div>{formatDate(deploy.createdAt)}</div>
                {deploy.buildDurationMs && <div className="font-mono">{(deploy.buildDurationMs / 1000).toFixed(1)}s</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── 部署状态图标 ───
function DeployStatusIcon({ status }: { status: DeployStatus }) {
  const config = {
    queued: { icon: LucideIcons.Clock, color: "text-muted-foreground/40" },
    building: { icon: LucideIcons.Loader, color: "text-warning animate-spin" },
    deploying: { icon: LucideIcons.Upload, color: "text-primary" },
    live: { icon: LucideIcons.CheckCircle2, color: "text-success" },
    failed: { icon: LucideIcons.XCircle, color: "text-destructive" },
    cancelled: { icon: LucideIcons.Ban, color: "text-muted-foreground/40" },
  }[status] ?? { icon: LucideIcons.Circle, color: "text-muted-foreground/40" };
  const Icon = config.icon;
  return <Icon size={16} className={config.color} />;
}

function DeployStatusBadge({ status }: { status: DeployStatus }) {
  const cls = {
    queued: "bg-muted-foreground/10 text-muted-foreground",
    building: "bg-warning/10 text-warning",
    deploying: "bg-primary/10 text-primary",
    live: "bg-success/10 text-success",
    failed: "bg-destructive/10 text-destructive",
    cancelled: "bg-muted-foreground/10 text-muted-foreground",
  }[status] ?? "bg-muted-foreground/10 text-muted-foreground";
  return <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-medium uppercase", cls)}>{status}</span>;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
