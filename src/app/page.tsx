import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { EditorSection } from "@/components/sections/editor-section";
import { TemplatesSection } from "@/components/sections/templates-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { DeploySection } from "@/components/sections/deploy-section";
import { PricingSection } from "@/components/sections/pricing-section";

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <EditorSection />
        <TemplatesSection />
        <ProjectsSection />
        <DeploySection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
