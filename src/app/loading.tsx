import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      {/* Fixed background placeholder */}
      <div className="fixed inset-0 -z-10 bg-background" />

      {/* Nav skeleton */}
      <div className="fixed top-0 z-40 h-16 w-full">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="hidden items-center gap-4 md:flex">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-16" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="hidden h-9 w-20 sm:block" />
            <Skeleton className="hidden h-9 w-28 sm:block" />
          </div>
        </Container>
      </div>

      {/* Hero skeleton */}
      <Container className="flex flex-col items-center pt-32 sm:pt-36 lg:pt-40">
        <Skeleton className="h-7 w-48 rounded-full" />
        <Skeleton className="mt-6 h-12 w-80" />
        <Skeleton className="mt-2 h-12 w-64" />
        <Skeleton className="mt-6 h-5 w-96 max-w-full" />
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
        <Skeleton className="mt-16 h-80 w-full max-w-4xl rounded-2xl" />
      </Container>

      {/* Features skeleton */}
      <Container className="mt-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </Container>
    </>
  );
}
