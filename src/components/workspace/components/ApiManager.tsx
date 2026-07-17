"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import type { ApiMethod } from "../types";

// ═══════════════════════════════════════════════════════════════
// ApiManager — API 端点管理
// 展示: 端点列表 / 方法/路径/认证/限流 / 新增/编辑
// ═══════════════════════════════════════════════════════════════

const METHOD_COLORS: Record<ApiMethod, string> = {
  GET: "bg-blue-500/15 text-blue-400",
  POST: "bg-green-500/15 text-green-400",
  PUT: "bg-orange-500/15 text-orange-400",
  PATCH: "bg-yellow-500/15 text-yellow-400",
  DELETE: "bg-red-500/15 text-red-400",
};

export function ApiManager() {
  const apiEndpoints = useWorkspaceStore((s) => s.apiEndpoints);
  const [showNew, setShowNew] = useState(false);
  const [newMethod, setNewMethod] = useState<ApiMethod>("GET");
  const [newPath, setNewPath] = useState("");

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* ─── 标题 ─── */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">API Endpoints</h2>
          <p className="mt-0.5 text-xs text-muted-foreground/50">{apiEndpoints.length} routes · {apiEndpoints.filter((a) => a.isActive).length} active</p>
        </div>
        <button
          onClick={() => setShowNew((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white shadow-glow"
        >
          <LucideIcons.Plus size={13} />
          New Endpoint
        </button>
      </div>

      {/* ─── 新建表单 ─── */}
      {showNew && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/[0.08] bg-foreground/[0.02] p-3">
          <select
            value={newMethod}
            onChange={(e) => setNewMethod(e.target.value as ApiMethod)}
            className="rounded-lg bg-background px-2 py-1.5 text-xs font-mono font-bold focus:outline-none"
          >
            {(["GET", "POST", "PUT", "PATCH", "DELETE"] as ApiMethod[]).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            placeholder="/api/path"
            className="flex-1 rounded-lg bg-background px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <button
            onClick={() => { setNewPath(""); setShowNew(false); }}
            className="rounded-lg bg-success/15 px-3 py-1.5 text-xs text-success"
          >
            Create
          </button>
        </div>
      )}

      {/* ─── 端点列表 ─── */}
      <div className="glass overflow-hidden rounded-xl">
        {apiEndpoints.map((endpoint, i) => (
          <div
            key={endpoint.id}
            className={cn(
              "group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-foreground/[0.02]",
              i > 0 && "border-t border-border/[0.04]",
            )}
          >
            {/* 方法标签 */}
            <span className={cn("w-14 shrink-0 rounded-md px-2 py-0.5 text-center font-mono text-[10px] font-bold", METHOD_COLORS[endpoint.method])}>
              {endpoint.method}
            </span>

            {/* 路径 + 描述 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-mono text-xs text-foreground">{endpoint.path}</span>
                {endpoint.authRequired && (
                  <span className="flex items-center gap-0.5 rounded bg-warning/10 px-1 py-0.5 text-[9px] text-warning">
                    <LucideIcons.Lock size={8} />
                    Auth
                  </span>
                )}
                {endpoint.rateLimit && (
                  <span className="flex items-center gap-0.5 rounded bg-foreground/5 px-1 py-0.5 text-[9px] text-muted-foreground/50">
                    <LucideIcons.Gauge size={8} />
                    {endpoint.rateLimit}/min
                  </span>
                )}
              </div>
              {endpoint.description && (
                <div className="mt-0.5 truncate text-[10px] text-muted-foreground/40">{endpoint.description}</div>
              )}
            </div>

            {/* 状态 + 操作 */}
            <div className="flex shrink-0 items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", endpoint.isActive ? "bg-success" : "bg-muted-foreground/20")} />
              <button className="rounded p-1 text-muted-foreground/30 opacity-0 transition-all hover:text-foreground group-hover:opacity-100">
                <LucideIcons.Pencil size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
