import { formatSessionDate, getEvaluationStatus, getStudentName } from "../utils";
import { SessionStatusBadge } from "./SessionStatusBadge";

export function SessionCard({ session, onViewDetails, onOpenEvaluation }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{getStudentName(session)}</div>
          <div className="text-xs text-muted-foreground">{formatSessionDate(session.startTime)}</div>
        </div>
        <SessionStatusBadge status={session.status} />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{session.description ?? "-"}</p>

      <div className="mt-3 text-xs text-muted-foreground">Evaluation: {getEvaluationStatus(session)}</div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(session)}
          className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs"
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => onOpenEvaluation(session)}
          className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs"
        >
          Evaluation
        </button>
      </div>
    </div>
  );
}
