"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { pricingTiers, enterpriseTier } from "@/config/pricing";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20 py-24 sm:py-28">
      <SectionHeading
        badge="Pricing"
        title="Simple, transparent"
        highlight="pricing"
        description="Start free. Upgrade when you ship. No hidden fees, cancel anytime."
      />

      <Container className="mt-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className={cn(
                "glass relative rounded-2xl p-6 shadow-glass",
                tier.popular &&
                  "border-primary/30 shadow-glow lg:-translate-y-2"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-glow">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-semibold text-foreground">
                {tier.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {tier.description}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold">
                  {tier.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tier.period}
                </span>
              </div>

              <Button
                variant={tier.popular ? "primary" : "secondary"}
                size="md"
                className="mt-6 w-full"
              >
                {tier.cta}
                <ArrowRight size={14} />
              </Button>

              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check size={14} className="text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Enterprise bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="glass mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl p-6 sm:flex-row"
        >
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-foreground">
              {enterpriseTier.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {enterpriseTier.description}
            </p>
          </div>
          <Button variant="outline" size="md" className="shrink-0">
            {enterpriseTier.cta}
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
