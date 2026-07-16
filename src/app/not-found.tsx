import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">
        <p className="font-display text-7xl font-semibold text-gradient sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gradient-brand px-6 text-sm font-medium text-white shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
        >
          <Home size={14} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
