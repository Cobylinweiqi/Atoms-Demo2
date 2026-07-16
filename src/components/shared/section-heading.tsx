"use client";

import { motion } from "framer-motion";
import { Container } from "./container";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function SectionHeading({
  badge,
  title,
  highlight,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Container
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="glass inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease, delay: 0.1 }}
        className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
      >
        {title}{" "}
        {highlight && <span className="text-gradient">{highlight}</span>}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </Container>
  );
}
