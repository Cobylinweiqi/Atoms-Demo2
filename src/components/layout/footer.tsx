import { Github, Twitter, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

const footerLinks = {
  Product: ["Features", "Templates", "Pricing", "Showcase"],
  Resources: ["Documentation", "Blog", "Changelog", "Status"],
  Company: ["About", "Careers", "Contact", "Privacy"],
};

const socialLinks = [
  { icon: Github, label: "GitHub", href: siteConfig.links.github },
  { icon: Twitter, label: "Twitter", href: siteConfig.links.twitter },
  { icon: MessageCircle, label: "Discord", href: siteConfig.links.discord },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/6 py-16">
      <Container>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold">
                Nova<span className="text-gradient"> Studio</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI Full Stack Builder. Chat, edit, deploy — all in one place.
              Build your next project in minutes, not weeks.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-8 sm:gap-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/6 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Nova Studio. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Crafted with precision.
          </p>
        </div>
      </Container>
    </footer>
  );
}
