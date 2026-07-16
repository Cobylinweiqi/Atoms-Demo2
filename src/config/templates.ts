export interface Template {
  name: string;
  category: string;
  description: string;
  icon: string;
}

export const templateCategories = [
  "All",
  "Website",
  "SaaS",
  "Dashboard",
  "E-commerce",
  "Blog",
  "AI Agent",
] as const;

export const templates: Template[] = [
  { name: "SaaS Starter", category: "SaaS", description: "Auth + billing + dashboard", icon: "rocket" },
  { name: "Landing Page", category: "Website", description: "Hero + features + CTA", icon: "layout" },
  { name: "Admin Dashboard", category: "Dashboard", description: "Charts + tables + sidebar", icon: "chart" },
  { name: "E-commerce", category: "E-commerce", description: "Products + cart + checkout", icon: "shopping" },
  { name: "Blog", category: "Blog", description: "MDX + SEO + comments", icon: "pen" },
  { name: "AI Agent", category: "AI Agent", description: "Flow builder + API", icon: "bot" },
  { name: "CRM", category: "Dashboard", description: "Contacts + pipeline + notes", icon: "users" },
  { name: "Portfolio", category: "Website", description: "Projects + about + contact", icon: "briefcase" },
];
