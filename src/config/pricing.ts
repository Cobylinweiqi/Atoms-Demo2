export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying things out.",
    features: [
      "3 projects",
      "100 AI messages / day",
      "Preview deployment",
      "Community support",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$20",
    period: "/month",
    description: "For builders who ship.",
    features: [
      "Unlimited projects",
      "1,000 AI messages / day",
      "Production deployment",
      "Custom domain",
      "All AI models",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Team",
    price: "$40",
    period: "/user/month",
    description: "For collaborative teams.",
    features: [
      "Everything in Pro",
      "Team seats & roles",
      "GitHub Sync",
      "3,000 AI messages / day",
      "Priority support",
    ],
    cta: "Get Started",
  },
];

export const enterpriseTier = {
  name: "Enterprise",
  description:
    "Custom pricing · SSO · Audit logs · On-premise deployment · Dedicated support",
  cta: "Contact Sales",
  href: "mailto:sales@nova-studio.app",
};
