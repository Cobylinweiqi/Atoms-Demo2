"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { HeroShowcase } from "./hero-showcase";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  return (
    <section className="relative pt-32 sm:pt-36 lg:pt-40">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.a
            href="#features"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors hover:border-border/12"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-muted-foreground">
              Introducing Nova Studio v1.0
            </span>
            <ArrowRight size={12} className="text-muted-foreground" />
          </motion.a>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Build full-stack apps
            <br />
            <span className="text-gradient">by chatting.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Describe what you want. Nova generates production-ready code,
            deploys to the cloud, and syncs with GitHub. No boilerplate, no
            setup — just build.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Start Building
              <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Showcase */}
        <HeroShowcase />
      </Container>
    </section>
  );
}
