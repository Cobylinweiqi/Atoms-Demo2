import {
  MessageSquareCode,
  MousePointerClick,
  Palette,
  Rocket,
  Github,
  Boxes,
} from "lucide-react";

export interface Feature {
  icon: typeof MessageSquareCode;
  title: string;
  description: string;
  accent: string;
}

export const features: Feature[] = [
  {
    icon: MessageSquareCode,
    title: "AI Chat",
    description:
      "Describe what you want in plain language. AI writes production-ready full-stack code with context awareness.",
    accent: "hsl(258 90% 66%)",
  },
  {
    icon: MousePointerClick,
    title: "Visual Editor",
    description:
      "Drag, drop, edit. Code and visual editor stay in perfect sync with bidirectional AST-level updates.",
    accent: "hsl(239 84% 67%)",
  },
  {
    icon: Palette,
    title: "Theme Editor",
    description:
      "Colors, typography, spacing, shadows. Fine-tune every design token with live preview and export.",
    accent: "hsl(189 94% 43%)",
  },
  {
    icon: Boxes,
    title: "Component Library",
    description:
      "30+ pre-built components. Create your own. Search, preview, and insert directly into your canvas.",
    accent: "hsl(258 90% 66%)",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description:
      "Ship to Vercel, Netlify, or your own infrastructure in seconds. Custom domains and SSL included.",
    accent: "hsl(239 84% 67%)",
  },
  {
    icon: Github,
    title: "GitHub Sync",
    description:
      "Push your project to GitHub. Pull changes back. Manage branches and create PRs without leaving.",
    accent: "hsl(189 94% 43%)",
  },
];
