import { StatCard } from "./StatCard";

export function SummaryCards({ stats }) {
  const avg = typeof stats?.averageRating === "number" && stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)}/5` : "—";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Sessions" value={stats?.totalSessions ?? "—"} hint="All-time" />
      <StatCard label="Upcoming Sessions" value={stats?.upcomingSessions ?? "—"} hint="Scheduled" />
      <StatCard label="Completed Reviews" value={stats?.completedReviews ?? "—"} hint="Evaluated sessions" />
      <StatCard label="Average Rating" value={avg} hint="From evaluated sessions" />
    </div>
  );
}
