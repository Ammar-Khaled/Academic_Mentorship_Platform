export function SessionsEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <h3 className="text-lg font-semibold">No sessions found</h3>
      <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or date filters.</p>
    </div>
  );
}
