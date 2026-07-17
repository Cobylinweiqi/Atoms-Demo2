"use client";

import { cn } from "@/lib/utils";
import { PLATFORMS, type DeployPlatform } from "../types";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ProviderSelectorProps {
  selected: DeployPlatform;
  onSelect: (platform: DeployPlatform) => void;
  disabled?: boolean;
}

function getIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? LucideIcons.Cloud;
}

export function ProviderSelector({ selected, onSelect, disabled }: ProviderSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PLATFORMS.map((platform) => {
        const Icon = getIcon(platform.icon);
        const isActive = selected === platform.id;
        return (
          <button
            key={platform.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(platform.id)}
            className={cn(
              "group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
              isActive
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                : "border-border hover:border-primary/40 hover:bg-muted/50",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${platform.color}15`, color: platform.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
              {isActive && (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <LucideIcons.Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{platform.label}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {platform.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
