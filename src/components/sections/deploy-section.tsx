"use client";

import { motion } from "framer-motion";
import { Rocket, Globe, GitBranch, Shield, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";

const ease = [0.22, 1, 0.36, 1] as const;

const deployFeatures = [
  { icon: Zap, title: "Instant Deploy", desc: "Ship to global edge in seconds" },
  { icon: Globe, title: "Custom Domain", desc: "Bring your own domain + SSL" },
  { icon: GitBranch, title: "Git-based", desc: "Every deploy is a Git commit" },
  { icon: Shield, title: "Automatic HTTPS", desc: "SSL certificates managed for you" },
];

export function DeploySection() {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <div className="glass relative overflow-hidden rounded-3xl p-8 shadow-glass sm:p-12 lg:p-16">
          {/* Background glow */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {/* Left: Content */}
            <div>
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
                <Rocket size={12} /> Deploy
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Ship to production
                <br />
                <span className="text-gradient">in one click.</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                No DevOps required. Nova handles builds, CDN, SSL, and custom
                domains. Every deploy is versioned and instantly rolled back
                if needed.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="mt-6 flex items-center gap-3 rounded-xl border border-white/6 bg-white/4 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15">
                  <Rocket size={18} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Deployed to production
                  </p>
                  <p className="text-xs text-muted-foreground">
                    nova-studio.app · 42s build · Global CDN
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Feature grid */}
            <div className="grid grid-cols-2 gap-4">
              {deployFeatures.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                  className="rounded-xl border border-white/6 bg-white/4 p-4"
                >
                  <item.icon size={20} className="text-primary" />
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
