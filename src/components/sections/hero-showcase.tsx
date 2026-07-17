"use client";

import { motion } from "framer-motion";
import { Code2, Eye, GitBranch, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const chatMessages = [
  {
    role: "user" as const,
    text: "Create a SaaS dashboard with auth + billing",
  },
  {
    role: "ai" as const,
    text: "Generating full-stack app with Next.js, Stripe, and PostgreSQL...",
  },
];

const fileSteps = [
  "app/layout.tsx",
  "app/(dashboard)/page.tsx",
  "components/billing-form.tsx",
  "lib/stripe.ts",
  "prisma/schema.prisma",
];

const tabs = [
  { icon: Code2, label: "Code", active: true },
  { icon: Eye, label: "Preview", active: false },
  { icon: GitBranch, label: "Branch", active: false },
];

export function HeroShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease, delay: 0.4 }}
      className="relative mx-auto mt-16 w-full max-w-4xl"
      style={{ perspective: 1000 }}
    >
      {/* Glow */}
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-brand-soft blur-2xl" />

      {/* Card */}
      <div className="glass overflow-hidden rounded-2xl shadow-glass">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-border/6 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/60" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <span className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          <div className="ml-4 flex gap-1">
            {tabs.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "bg-foreground/8 text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon size={13} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Chat + Files */}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Chat */}
          <div className="space-y-3 border-b border-border/6 p-4 sm:border-b-0 sm:border-r">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.3, ease }}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" && "flex-row"
                )}
              >
                {msg.role === "user" ? (
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground/8 text-[10px] font-bold">
                      U
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.text}</p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-white">
                      AI
                    </div>
                    <p className="text-sm text-foreground">{msg.text}</p>
                  </div>
                )}
              </motion.div>
            ))}
            {/* Typing indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-brand text-[10px] font-bold text-white">
                AI
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: d * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* File list */}
          <div className="p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Generated Files
            </p>
            <div className="space-y-1.5">
              {fileSteps.map((file, i) => (
                <motion.div
                  key={file}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.15, ease }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                >
                  <Check size={14} className="text-success" />
                  <code className="font-mono text-xs text-muted-foreground">
                    {file}
                  </code>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, ease }}
        className="absolute -left-4 top-1/3 hidden md:block"
      >
        <div className="glass rounded-xl px-4 py-3 shadow-glass">
          <p className="text-xs text-muted-foreground">Build time</p>
          <p className="font-display text-lg font-semibold text-gradient">
            42s
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, ease }}
        className="absolute -right-4 bottom-1/3 hidden md:block"
      >
        <div className="glass rounded-xl px-4 py-3 shadow-glass">
          <p className="text-xs text-muted-foreground">Deploy</p>
          <p className="font-display text-lg font-semibold text-success">
            Live ✓
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
