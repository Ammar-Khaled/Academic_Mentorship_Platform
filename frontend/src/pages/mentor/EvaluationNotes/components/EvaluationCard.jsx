import { formatSessionDate, getStudentName, hasEvaluationNote } from "../utils";

export function EvaluationCard({ session, onView, onEdit }) {
  const reviewed = hasEvaluationNote(session);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-medium">{getStudentName(session)}</div>
          <div className="text-xs text-muted-foreground">{formatSessionDate(session.startTime)}</div>
        </div>

        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            reviewed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {reviewed ? "Completed" : "Pending"}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{session.evaluationNotes || "No evaluation note yet."}</p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onView(session)}
          className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onEdit(session)}
          className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium"
        >
          {reviewed ? "Edit" : "Add Note"}
        </button>
      </div>
    </div>
  );
}
