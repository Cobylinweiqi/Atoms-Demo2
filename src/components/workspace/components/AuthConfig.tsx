"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import type { AuthProviderType } from "../types";

// ═══════════════════════════════════════════════════════════════
// AuthConfig — 认证配置
// 展示: 认证提供商开关 / OAuth 配置 / 重定向 URL
// ═══════════════════════════════════════════════════════════════

const PROVIDER_CONFIG: Record<AuthProviderType, { icon: LucideIcons.LucideIcon; label: string; color: string }> = {
  email: { icon: LucideIcons.Mail, label: "Email & Password", color: "text-blue-400" },
  google: { icon: LucideIcons.Chrome, label: "Google OAuth", color: "text-red-400" },
  github: { icon: LucideIcons.Github, label: "GitHub OAuth", color: "text-foreground" },
  apple: { icon: LucideIcons.Apple, label: "Apple Sign In", color: "text-foreground" },
  "magic-link": { icon: LucideIcons.MailCheck, label: "Magic Link", color: "text-purple-400" },
  saml: { icon: LucideIcons.KeySquare, label: "SAML SSO", color: "text-orange-400" },
};

export function AuthConfig() {
  const authConfigs = useWorkspaceStore((s) => s.authConfigs);
  const toggleAuthProvider = useWorkspaceStore((s) => s.toggleAuthProvider);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-1 text-lg font-semibold text-foreground">Authentication</h2>
      <p className="mb-4 text-xs text-muted-foreground/50">
        Configure authentication providers for your project. Users can sign in with any enabled provider.
      </p>

      {/* ─── 提供商列表 ─── */}
      <div className="space-y-2">
        {(Object.keys(PROVIDER_CONFIG) as AuthProviderType[]).map((provider) => {
          const config = authConfigs.find((a) => a.provider === provider);
          const isEnabled = config?.isEnabled ?? false;
          const provConfig = PROVIDER_CONFIG[provider];
          const Icon = provConfig.icon;

          return (
            <div
              key={provider}
              className={cn(
                "rounded-2xl border p-4 transition-all",
                isEnabled ? "border-primary/20 bg-gradient-brand-soft" : "border-border/[0.06] bg-foreground/[0.02]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isEnabled ? "bg-primary/10" : "bg-foreground/5")}>
                  <Icon size={18} className={isEnabled ? "text-primary" : provConfig.color} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{provConfig.label}</div>
                  <div className="text-[10px] text-muted-foreground/40">
                    {isEnabled ? "Enabled" : "Disabled"}
                  </div>
                </div>
                {/* Toggle 开关 */}
                <button
                  onClick={() => toggleAuthProvider(provider)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    isEnabled ? "bg-success" : "bg-foreground/10",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                      isEnabled ? "translate-x-5" : "translate-x-0.5",
                    )}
                  />
                </button>
              </div>

              {/* 展开配置 (启用时) */}
              {isEnabled && config && (
                <div className="mt-4 space-y-3 border-t border-border/[0.06] pt-4">
                  {provider !== "email" && provider !== "magic-link" && (
                    <>
                      <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                          Client ID
                        </label>
                        <input
                          value={config.clientId ?? ""}
                          readOnly
                          placeholder="Enter Client ID"
                          className="w-full rounded-lg bg-foreground/[0.03] px-3 py-1.5 font-mono text-xs text-foreground/70 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                          Client Secret
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          className="w-full rounded-lg bg-foreground/[0.03] px-3 py-1.5 font-mono text-xs text-foreground/70 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                          Redirect URL
                        </label>
                        <input
                          value={config.redirectUrl ?? ""}
                          readOnly
                          placeholder="/api/auth/callback"
                          className="w-full rounded-lg bg-foreground/[0.03] px-3 py-1.5 font-mono text-xs text-foreground/70 focus:outline-none"
                        />
                      </div>
                      {config.scopes.length > 0 && (
                        <div>
                          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                            Scopes
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {config.scopes.map((scope) => (
                              <span key={scope} className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground/60">
                                {scope}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
