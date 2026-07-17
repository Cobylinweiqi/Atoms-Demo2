"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Layout, Rocket, BarChart3, ShoppingBag, Pen, Bot, Users, Briefcase } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { templates, templateCategories } from "@/config/templates";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const iconMap: Record<string, typeof Layout> = {
  layout: Layout,
  rocket: Rocket,
  chart: BarChart3,
  shopping: ShoppingBag,
  pen: Pen,
  bot: Bot,
  users: Users,
  briefcase: Briefcase,
};

export function TemplatesSection() {
  const [active, setActive] = React.useState("All");

  const filtered = React.useMemo(() => {
    if (active === "All") return templates;
    return templates.filter((t) => t.category === active);
  }, [active]);

  return (
    <section id="templates" className="scroll-mt-20 py-24 sm:py-28">
      <SectionHeading
        badge="Templates"
        title="Start from a"
        highlight="template"
        description="Production-ready starters for every use case. Clone, customize, and deploy."
      />

      <Container className="mt-8">
        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {templateCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                active === cat
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "glass text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Container>

      {/* Grid */}
      <Container className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((template, i) => {
            const Icon = iconMap[template.icon] ?? Layout;
            return (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                className="group glass rounded-2xl p-5 shadow-glass transition-all duration-200 hover:-translate-y-1 hover:border-border/12 hover:shadow-glow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {template.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {template.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
