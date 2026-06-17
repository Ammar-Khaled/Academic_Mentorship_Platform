export function EvaluationEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <h3 className="text-lg font-semibold">No evaluations found</h3>
      <p className="mt-2 text-sm text-muted-foreground">No completed sessions matched your current filters.</p>
    </div>
  );
}
