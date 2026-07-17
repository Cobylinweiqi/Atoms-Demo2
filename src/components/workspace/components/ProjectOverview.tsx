"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";

// ═══════════════════════════════════════════════════════════════
// ProjectOverview — 项目概览
// 展示: 项目信息 / 环境状态 / 部署统计 / 用量 / 最近活动
// ═══════════════════════════════════════════════════════════════

export function ProjectOverview() {
  const project = useWorkspaceStore((s) => s.currentProject);
  const environments = useWorkspaceStore((s) => s.environments);
  const deployments = useWorkspaceStore((s) => s.deployments);
  const billing = useWorkspaceStore((s) => s.billing);
  const history = useWorkspaceStore((s) => s.history);
  const apiEndpoints = useWorkspaceStore((s) => s.apiEndpoints);

  const liveDeployments = deployments.filter((d) => d.status === "live").length;
  const totalDeploys = deployments.length;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      {/* ─── 项目标题 ─── */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-xl font-bold text-white shadow-glow">
          {project?.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{project?.name}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground/60">{project?.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge>{project?.framework}</Badge>
            <Badge>{project?.type}</Badge>
            <Badge variant={project?.status === "active" ? "success" : "default"}>
              {project?.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* ─── 统计卡片 ─── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={LucideIcons.Server}
          label="Environments"
          value={environments.length}
          sub={`${environments.filter((e) => e.status === "active").length} active`}
          color="text-primary"
        />
        <StatCard
          icon={LucideIcons.Rocket}
          label="Deployments"
          value={totalDeploys}
          sub={`${liveDeployments} live`}
          color="text-success"
        />
        <StatCard
          icon={LucideIcons.Webhook}
          label="API Routes"
          value={apiEndpoints.length}
          sub={`${apiEndpoints.filter((a) => a.isActive).length} active`}
          color="text-warning"
        />
        <StatCard
          icon={LucideIcons.Cpu}
          label="AI Tokens"
          value={formatNum(billing?.usage.aiTokens ?? 0)}
          sub={`of ${formatNum(billing?.usage.aiTokensLimit ?? 0)}`}
          color="text-muted-foreground"
        />
      </div>

      {/* ─── 环境状态 ─── */}
      <div className="glass rounded-2xl p-4">
        <SectionHeader icon={LucideIcons.Server} title="Environments" />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {environments.map((env) => (
            <div
              key={env.id}
              className="flex items-center gap-3 rounded-xl border border-border/[0.06] bg-foreground/[0.02] p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                <EnvTypeIcon type={env.type} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-foreground">{env.name}</div>
                <div className="truncate text-[10px] text-muted-foreground/50">{env.url ?? "No URL"}</div>
              </div>
              <EnvStatusBadge status={env.status} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── 用量进度 ─── */}
      {billing && (
        <div className="glass rounded-2xl p-4">
          <SectionHeader icon={LucideIcons.Gauge} title="Usage (Pro Plan)" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <UsageBar label="AI Tokens" current={billing.usage.aiTokens} limit={billing.usage.aiTokensLimit} unit="" formatter={formatNum} />
            <UsageBar label="Build Minutes" current={billing.usage.buildMinutes} limit={billing.usage.buildMinutesLimit} unit="min" />
            <UsageBar label="Bandwidth" current={billing.usage.bandwidthMb} limit={billing.usage.bandwidthLimitMb} unit="MB" />
            <UsageBar label="Storage" current={billing.usage.storageMb} limit={billing.usage.storageLimitMb} unit="MB" />
          </div>
        </div>
      )}

      {/* ─── 最近活动 ─── */}
      <div className="glass rounded-2xl p-4">
        <SectionHeader icon={LucideIcons.Activity} title="Recent Activity" />
        <div className="flex flex-col gap-1">
          {history.slice(0, 5).map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-foreground/[0.02]">
              <ActionIcon action={entry.action} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs text-foreground">{entry.description}</div>
                <div className="text-[10px] text-muted-foreground/40">{entry.targetName}</div>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground/30">{timeAgo(entry.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 辅助组件 ───

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" }) {
  const cls = {
    default: "bg-foreground/5 text-muted-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  }[variant];
  return <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium uppercase", cls)}>{children}</span>;
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: LucideIcons.LucideIcon; label: string; value: number | string; sub: string; color: string;
}) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-2">
        <Icon size={14} className={color} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">{label}</span>
      </div>
      <div className="mt-1.5 text-2xl font-bold text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground/40">{sub}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: LucideIcons.LucideIcon; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon size={14} className="text-primary" />
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

function UsageBar({ label, current, limit, unit, formatter }: {
  label: string; current: number; limit: number; unit: string; formatter?: (n: number) => string;
}) {
  const pct = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const color = pct > 80 ? "bg-destructive" : pct > 60 ? "bg-warning" : "bg-gradient-brand";
  const fmt = formatter ?? ((n: number) => String(n));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground/60">{label}</span>
        <span className="font-mono text-muted-foreground/40">{fmt(current)} / {fmt(limit)} {unit}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/5">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EnvTypeIcon({ type }: { type: string }) {
  const icon = { development: LucideIcons.Code, preview: LucideIcons.Eye, staging: LucideIcons.FlaskConical, production: LucideIcons.Globe }[type] ?? LucideIcons.Server;
  const Icon = icon;
  return <Icon size={16} className="text-primary/60" />;
}

function EnvStatusBadge({ status }: { status: string }) {
  const cls = { active: "bg-success/10 text-success", sleeping: "bg-muted-foreground/10 text-muted-foreground", building: "bg-warning/10 text-warning", error: "bg-destructive/10 text-destructive" }[status] ?? "bg-muted-foreground/10 text-muted-foreground";
  return <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-medium uppercase", cls)}>{status}</span>;
}

function ActionIcon({ action }: { action: string }) {
  const config = {
    create: { icon: LucideIcons.Plus, color: "text-success" },
    update: { icon: LucideIcons.Edit, color: "text-primary" },
    delete: { icon: LucideIcons.Trash, color: "text-destructive" },
    deploy: { icon: LucideIcons.Rocket, color: "text-warning" },
    rollback: { icon: LucideIcons.Undo, color: "text-destructive" },
    config: { icon: LucideIcons.Settings, color: "text-muted-foreground" },
  }[action] ?? { icon: LucideIcons.Circle, color: "text-muted-foreground" };
  const Icon = config.icon;
  return <Icon size={12} className={config.color} />;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
