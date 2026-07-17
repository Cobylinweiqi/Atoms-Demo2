"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Github, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { navItems } from "@/config/nav";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      className="fixed top-0 z-40 w-full"
    >
      <Container className="flex h-16 items-center justify-between md:h-[72px]">
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Nova<span className="text-gradient"> Studio</span>
            </span>
          </a>
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/nova-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground sm:flex"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button variant="primary" size="sm" className="hidden sm:inline-flex">
            Start Building
          </Button>
          <MobileNav />
        </div>
      </Container>

      {/* Scroll border line */}
      <div
        className={cn(
          "mx-auto h-px max-w-7xl transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0"
        )}
        style={{ background: "linear-gradient(to right, transparent, hsl(0 0% 100% / 0.10), transparent)" }}
      />
    </motion.header>
  );
}
