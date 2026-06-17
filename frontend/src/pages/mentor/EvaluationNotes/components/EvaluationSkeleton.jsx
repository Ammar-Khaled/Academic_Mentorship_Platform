export function EvaluationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-80 animate-pulse rounded-md bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
      <div className="h-16 animate-pulse rounded-md bg-muted" />
      <div className="h-80 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
