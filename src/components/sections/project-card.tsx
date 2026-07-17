"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProjectShowcase } from "@/config/projects";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

interface ProjectCardProps {
  project: ProjectShowcase;
  index: number;
  featured?: boolean;
}

export function ProjectCard({ project, index, featured }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease, delay: index * 0.08 }}
      className={cn(
        "group glass rounded-2xl p-5 shadow-glass transition-all duration-200",
        "hover:-translate-y-1 hover:border-border/12 hover:shadow-glow",
        featured && "sm:col-span-2 sm:row-span-2"
      )}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-brand-soft" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {project.title}
            </p>
            <p className="text-xs text-muted-foreground">{project.timeAgo}</p>
          </div>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Preview area */}
      <div className="mt-4 h-32 overflow-hidden rounded-xl bg-surface-2 sm:h-40">
        <div className="dot-grid flex h-full items-center justify-center">
          <Globe size={32} className="text-muted-foreground/30" />
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="default" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{project.type}</span>
      </div>
    </motion.div>
  );
}
