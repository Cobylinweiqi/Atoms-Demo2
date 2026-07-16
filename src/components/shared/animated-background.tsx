"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-1 via-background to-background" />

      {/* Glow blobs */}
      <motion.div
        className="absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(258 90% 66% / 0.15), transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 h-[450px] w-[450px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(239 84% 67% / 0.12), transparent 70%)" }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.6, 0.4, 0.6] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, hsl(189 94% 43% / 0.08), transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid overlay */}
      <div className="dot-grid absolute inset-0 opacity-60" />

      {/* Noise */}
      <div className="noise absolute inset-0" />
    </div>
  );
}
