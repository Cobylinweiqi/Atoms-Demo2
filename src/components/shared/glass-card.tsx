import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({
  className,
  hover = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl shadow-glass",
        hover &&
          "transition-all duration-200 hover:-translate-y-1 hover:border-border/12 hover:shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
