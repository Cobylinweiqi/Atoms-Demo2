export interface ProjectShowcase {
  title: string;
  type: string;
  timeAgo: string;
  description: string;
  tags: string[];
}

export const projects: ProjectShowcase[] = [
  {
    title: "Analytics Hub",
    type: "SaaS",
    timeAgo: "2d ago",
    description: "Full-stack SaaS with authentication, billing, and real-time analytics dashboard.",
    tags: ["Next.js", "Tailwind", "Stripe"],
  },
  {
    title: "CRM Dashboard",
    type: "Dashboard",
    timeAgo: "5d ago",
    description: "Customer relationship management with data visualization and pipeline tracking.",
    tags: ["React", "D3", "Prisma"],
  },
  {
    title: "Nova Landing",
    type: "Website",
    timeAgo: "1w ago",
    description: "Marketing site with blog, SEO optimization, and newsletter signup.",
    tags: ["Next.js", "MDX", "SEO"],
  },
  {
    title: "Shop Flow",
    type: "E-commerce",
    timeAgo: "2w ago",
    description: "Online store with product catalog, shopping cart, and Stripe checkout.",
    tags: ["Next.js", "Stripe", "Postgres"],
  },
  {
    title: "AI Support Bot",
    type: "AI Agent",
    timeAgo: "3w ago",
    description: "Intelligent customer support agent with knowledge base and ticket routing.",
    tags: ["OpenAI", "Pinecone", "Webhooks"],
  },
  {
    title: "Task Board",
    type: "Internal Tool",
    timeAgo: "1mo ago",
    description: "Kanban-style project management with drag-and-drop and team assignments.",
    tags: ["React", "DnD", "Socket.io"],
  },
];
