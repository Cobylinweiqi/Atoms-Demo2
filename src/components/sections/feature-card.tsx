"use client";

import { motion } from "framer-motion";
import type { Feature } from "@/config/features";

const ease = [0.22, 1, 0.36, 1] as const;

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const { icon: Icon, title, description, accent } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease, delay: index * 0.08 }}
      className="group relative glass rounded-2xl p-6 shadow-glass transition-all duration-200 hover:-translate-y-1 hover:border-white/12"
    >
      {/* Glow on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top left, ${accent}15, transparent 60%)`,
        }}
      />

      {/* Icon */}
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-xl"
        style={{
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
        }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>

      {/* Content */}
      <h3 className="mt-5 text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}
