export const siteConfig = {
  name: "Nova Studio",
  description:
    "AI Full Stack Builder — 通过自然语言对话生成全栈应用。Chat, edit, deploy — all in one place.",
  url: "https://nova-studio.app",
  ogImage: "https://nova-studio.app/og.png",
  links: {
    twitter: "https://twitter.com/novastudio",
    github: "https://github.com/nova-studio",
    discord: "https://discord.gg/nova-studio",
  },
} as const;

export type SiteConfig = typeof siteConfig;
