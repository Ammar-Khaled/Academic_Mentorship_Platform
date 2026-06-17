function Stat({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function EvaluationStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Pending Reviews" value={stats.pendingReviews} hint="Completed sessions without notes" />
      <Stat label="Completed Reviews" value={stats.completedReviews} hint="Sessions with notes" />
      <Stat label="Average Rating" value={stats.averageRating ?? "-"} hint="From completed sessions" />
      <Stat label="Reviews This Week" value={stats.reviewsThisWeek} hint="Based on evaluatedAt" />
    </div>
  );
}
