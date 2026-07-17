"use client";

import { motion } from "framer-motion";
import { Code2, MousePointerClick, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  { icon: Code2, title: "Write", desc: "Edit code or AI generates it" },
  { icon: Zap, title: "Sync", desc: "AST-level bidirectional update" },
  { icon: MousePointerClick, title: "Preview", desc: "See changes instantly" },
];

export function EditorSection() {
  return (
    <section className="py-24 sm:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Content */}
          <div>
            <span className="glass inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
              Visual Editor
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Code and visual editor
              <br />
              <span className="text-gradient">in perfect sync.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Edit visually or write code. Changes reflect instantly in both
              directions thanks to AST-level synchronization. No more manual
              coordination between design and code.
            </p>

            {/* Steps */}
            <div className="mt-8 flex flex-col gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand-soft">
                    <step.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="relative"
          >
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-brand-soft blur-2xl" />
            <div className="glass overflow-hidden rounded-2xl shadow-glass">
              {/* Tab bar */}
              <div className="flex items-center gap-1 border-b border-border/6 px-4 py-2.5">
                <div className="flex items-center gap-1.5 rounded-lg bg-foreground/8 px-3 py-1 text-xs font-medium text-foreground">
                  <Code2 size={12} /> Code
                </div>
                <div className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium text-muted-foreground">
                  <MousePointerClick size={12} /> Visual
                </div>
              </div>

              {/* Split view */}
              <div className="grid grid-cols-2">
                {/* Code side */}
                <div className="border-r border-border/6 p-4">
                  <pre className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                    <code>{`<Button
  variant="primary"
  size="lg"
>
  Get Started
</Button>`}</code>
                  </pre>
                </div>
                {/* Visual side */}
                <div className="flex items-center justify-center p-4">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-6 py-3 text-sm font-medium text-white shadow-glow">
                    Get Started
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
