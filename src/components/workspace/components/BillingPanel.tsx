"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";

// ═══════════════════════════════════════════════════════════════
// BillingPanel — 账单面板
// 展示: 当前计划 / 用量统计 / 账单周期 / 升级
// ═══════════════════════════════════════════════════════════════

const PLAN_CONFIG = {
  free: { color: "text-muted-foreground", icon: LucideIcons.Circle },
  pro: { color: "text-primary", icon: LucideIcons.Zap },
  team: { color: "text-warning", icon: LucideIcons.Users },
  enterprise: { color: "text-success", icon: LucideIcons.Building2 },
};

export function BillingPanel() {
  const billing = useWorkspaceStore((s) => s.billing);

  if (!billing) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground/30">
        <span className="text-xs">No billing information</span>
      </div>
    );
  }

  const planConfig = PLAN_CONFIG[billing.plan];
  const PlanIcon = planConfig.icon;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      {/* ─── 当前计划 ─── */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
              <PlanIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold capitalize text-foreground">{billing.plan}</h2>
                <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium uppercase", billing.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                  {billing.status}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground/50">
                {formatDate(billing.currentPeriodStart)} → {formatDate(billing.currentPeriodEnd)}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl bg-foreground/5 px-3 py-2 text-xs font-medium text-foreground hover:bg-foreground/10">
            <LucideIcons.ArrowUpCircle size={14} />
            Upgrade
          </button>
        </div>
      </div>

      {/* ─── 用量详情 ─── */}
      <div className="glass rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Usage This Period</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UsageCard
            icon={LucideIcons.Cpu}
            label="AI Tokens"
            current={billing.usage.aiTokens}
            limit={billing.usage.aiTokensLimit}
            unit=""
            formatter={formatNum}
          />
          <UsageCard
            icon={LucideIcons.Hammer}
            label="Build Minutes"
            current={billing.usage.buildMinutes}
            limit={billing.usage.buildMinutesLimit}
            unit="min"
          />
          <UsageCard
            icon={LucideIcons.Wifi}
            label="Bandwidth"
            current={billing.usage.bandwidthMb}
            limit={billing.usage.bandwidthLimitMb}
            unit="MB"
          />
          <UsageCard
            icon={LucideIcons.HardDrive}
            label="Storage"
            current={billing.usage.storageMb}
            limit={billing.usage.storageLimitMb}
            unit="MB"
          />
          <UsageCard
            icon={LucideIcons.Rocket}
            label="Deployments"
            current={billing.usage.deployments}
            limit={billing.usage.deploymentsLimit}
            unit=""
          />
        </div>
      </div>

      {/* ─── 账单历史 ─── */}
      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Billing History</h3>
        <div className="flex flex-col gap-1">
          {[
            { date: "Jul 1, 2026", amount: "$20.00", status: "paid" },
            { date: "Jun 1, 2026", amount: "$20.00", status: "paid" },
            { date: "May 1, 2026", amount: "$20.00", status: "paid" },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-foreground/[0.02]">
              <LucideIcons.FileText size={14} className="text-muted-foreground/40" />
              <span className="flex-1 text-xs text-foreground">{invoice.date}</span>
              <span className="font-mono text-xs text-muted-foreground/60">{invoice.amount}</span>
              <span className="rounded-md bg-success/10 px-2 py-0.5 text-[9px] font-medium uppercase text-success">{invoice.status}</span>
              <button className="rounded p-1 text-muted-foreground/30 hover:text-foreground">
                <LucideIcons.Download size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsageCard({ icon: Icon, label, current, limit, unit, formatter }: {
  icon: LucideIcons.LucideIcon; label: string; current: number; limit: number; unit: string; formatter?: (n: number) => string;
}) {
  const pct = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const fmt = formatter ?? ((n: number) => String(n));
  const barColor = pct > 80 ? "bg-destructive" : pct > 60 ? "bg-warning" : "bg-gradient-brand";

  return (
    <div className="rounded-xl border border-border/[0.06] bg-foreground/[0.02] p-3">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-primary/60" />
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-lg font-bold text-foreground">{fmt(current)}</span>
        <span className="text-xs text-muted-foreground/40">/ {fmt(limit)} {unit}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/5">
        <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-right text-[10px] text-muted-foreground/30">{pct.toFixed(0)}%</div>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
