"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/config/nav";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 md:hidden"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease }}
              className="fixed right-0 top-0 z-50 h-full w-72 p-6 md:hidden"
            >
              <div className="glass-nav flex h-full flex-col rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">Nova</span>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="mt-8 flex flex-col gap-1">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground",
                        "transition-colors hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3">
                  <Button variant="ghost" size="md" onClick={() => setOpen(false)}>
                    Log in
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setOpen(false)}>
                    Start Building
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
