"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import type { EnvType, Environment } from "../types";

// ═══════════════════════════════════════════════════════════════
// EnvironmentManager — 环境管理
// 展示: 环境列表 / 变量管理 / 创建环境
// ═══════════════════════════════════════════════════════════════

const ENV_VARS: Record<string, string>[] = [
  { DATABASE_URL: "postgresql://nova:***@db.nova-studio.internal:5432/nova" },
  { NEXT_PUBLIC_API_URL: "https://api.nova-landing.com" },
  { STRIPE_SECRET_KEY: "sk_live_***" },
  { OPENAI_API_KEY: "sk-***" },
];

export function EnvironmentManager() {
  const environments = useWorkspaceStore((s) => s.environments);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const setActiveEnv = useWorkspaceStore((s) => s.setActiveEnvironment);
  const createEnvironment = useWorkspaceStore((s) => s.createEnvironment);
  const deleteEnvironment = useWorkspaceStore((s) => s.deleteEnvironment);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<EnvType>("staging");

  const activeEnv = environments.find((e) => e.id === activeEnvId);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createEnvironment({
      projectId: "proj_001",
      name: newName,
      type: newType,
      slug: newName.toLowerCase().replace(/\s+/g, "-"),
      status: "active",
      isDefault: false,
      config: {},
    });
    setNewName("");
    setShowCreate(false);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* ─── 环境卡片 ─── */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Environments</h2>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white shadow-glow"
        >
          <LucideIcons.Plus size={13} />
          New Environment
        </button>
      </div>

      {showCreate && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/[0.08] bg-foreground/[0.02] p-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Environment name (e.g. Staging)"
            className="flex-1 rounded-lg bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as EnvType)}
            className="rounded-lg bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="development">Development</option>
            <option value="preview">Preview</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
          <button onClick={handleCreate} className="rounded-lg bg-success/15 px-3 py-1.5 text-xs text-success hover:bg-success/25">
            Create
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {environments.map((env) => (
          <EnvCard
            key={env.id}
            env={env}
            isActive={env.id === activeEnvId}
            onClick={() => setActiveEnv(env.id)}
            onDelete={() => deleteEnvironment(env.id)}
          />
        ))}
      </div>

      {/* ─── 环境变量 ─── */}
      {activeEnv && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Environment Variables — <span className="text-primary">{activeEnv.name}</span>
          </h3>
          <div className="glass overflow-hidden rounded-xl">
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2 border-b border-border/[0.06] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
              <span>Key</span>
              <span>Value</span>
              <span>Secret</span>
            </div>
            {ENV_VARS.map((varObj, i) => {
              const [key, value] = Object.entries(varObj)[0];
              const isSecret = value.includes("***");
              return (
                <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 border-b border-border/[0.04] px-4 py-2 text-xs last:border-0 hover:bg-foreground/[0.02]">
                  <span className="font-mono text-foreground">{key}</span>
                  <span className="truncate font-mono text-muted-foreground/60">{value}</span>
                  <span className="flex items-center gap-1">
                    {isSecret ? (
                      <LucideIcons.Lock size={11} className="text-warning/60" />
                    ) : (
                      <LucideIcons.Unlock size={11} className="text-muted-foreground/30" />
                    )}
                  </span>
                </div>
              );
            })}
            <button className="flex w-full items-center gap-1.5 px-4 py-2 text-xs text-muted-foreground/50 transition-colors hover:bg-foreground/[0.02] hover:text-foreground">
              <LucideIcons.Plus size={12} />
              Add Variable
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EnvCard({ env, isActive, onClick, onDelete }: {
  env: Environment; isActive: boolean; onClick: () => void; onDelete: () => void;
}) {
  const typeIcon = { development: LucideIcons.Code, preview: LucideIcons.Eye, staging: LucideIcons.FlaskConical, production: LucideIcons.Globe }[env.type] ?? LucideIcons.Server;
  const Icon = typeIcon;
  const statusColor = { active: "text-success", sleeping: "text-muted-foreground", building: "text-warning", error: "text-destructive" }[env.status] ?? "text-muted-foreground";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-2xl border p-4 transition-all",
        isActive ? "border-primary/30 bg-gradient-brand-soft shadow-glow" : "border-border/[0.06] bg-foreground/[0.02] hover:border-border/12",
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isActive ? "bg-primary/10" : "bg-foreground/5")}>
          <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground/50"} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">{env.name}</span>
            {env.isDefault && <LucideIcons.Star size={10} className="text-primary fill-current" />}
          </div>
          <div className="truncate text-[10px] text-muted-foreground/40">{env.url ?? "No URL"}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="rounded p-0.5 text-muted-foreground/20 opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
        >
          <LucideIcons.Trash2 size={12} />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground/40">
        <span className="flex items-center gap-1">
          <span className={cn("h-1.5 w-1.5 rounded-full", statusColor.replace("text-", "bg-"))} />
          {env.status}
        </span>
        <span className="flex items-center gap-1">
          <LucideIcons.GitBranch size={9} />
          {env.branch ?? "—"}
        </span>
      </div>
    </div>
  );
}
