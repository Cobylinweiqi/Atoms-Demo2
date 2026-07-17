"use client";

import { cn } from "@/lib/utils";
import { STATUS_META, type DeployStatus } from "../types";
import { Loader2 } from "lucide-react";

interface DeployStatusBadgeProps {
  status: DeployStatus;
  size?: "sm" | "md";
  showPulse?: boolean;
  className?: string;
}

export function DeployStatusBadge({
  status,
  size = "md",
  showPulse = true,
  className,
}: DeployStatusBadgeProps) {
  const meta = STATUS_META[status];
  const sizeCls = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        meta.color,
        meta.bgColor,
        sizeCls,
        className,
      )}
    >
      {meta.isInProgress && showPulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: "currentColor" }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "currentColor" }} />
        </span>
      )}
      {meta.isLive && (
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" />
      )}
      {meta.isError && <span className="inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />}
      {meta.label}
      {meta.isInProgress && showPulse && <Loader2 className="h-3 w-3 animate-spin" />}
    </span>
  );
}
