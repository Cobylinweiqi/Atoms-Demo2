"use client";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "./project-card";
import { projects } from "@/config/projects";

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-20 py-24 sm:py-28">
      <SectionHeading
        badge="Showcase"
        title="Built with"
        highlight="Nova Studio"
        description="From SaaS platforms to internal tools — see what builders create in minutes."
      />
      <Container className="mt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              featured={i === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
