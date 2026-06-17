export function SessionStatusBadge({ status }) {
  const styles = {
    Scheduled: "bg-blue-100 text-blue-700",
    InProgress: "bg-violet-100 text-violet-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-rose-100 text-rose-700",
  };

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${styles[status] ?? "bg-muted text-muted-foreground"}`}>{status ?? "Unknown"}</span>;
}
