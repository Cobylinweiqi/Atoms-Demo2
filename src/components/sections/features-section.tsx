"use client";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureCard } from "./feature-card";
import { features } from "@/config/features";

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-24 sm:py-28">
      <SectionHeading
        badge="Features"
        title="Everything you need to"
        highlight="ship fast"
        description="Powerful AI generation, visual editing, theming, deployment, and GitHub sync — all integrated."
      />
      <Container className="mt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
