"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Container size="narrow" className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/15">
          <AlertTriangle size={28} className="text-destructive" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <code className="mt-4 rounded-lg border border-white/6 bg-white/4 px-3 py-1.5 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </code>
        )}
        <Button variant="primary" size="md" className="mt-8" onClick={reset}>
          <RefreshCw size={14} />
          Try Again
        </Button>
      </Container>
    </div>
  );
}
