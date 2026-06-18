import { formatSessionDate, getEvaluationStatus, getStudentName } from "../utils";
import { SessionStatusBadge } from "./SessionStatusBadge";

export function SessionDetailsDialog({ open, session, onClose, onOpenEvaluation }) {
  if (!open || !session) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-background p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Session Details</h3>
            <p className="text-sm text-muted-foreground">Review session metadata and evaluation progress.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-border px-2 py-1 text-xs">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Student</div>
            <div className="mt-1 font-medium">{getStudentName(session)}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Session Date</div>
            <div className="mt-1 font-medium">{formatSessionDate(session.startTime)}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Ends At</div>
            <div className="mt-1 font-medium">{formatSessionDate(session.endTime)}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="mt-1">
              <SessionStatusBadge status={session.status} />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-border p-3">
          <div className="text-xs text-muted-foreground">Description</div>
          <p className="mt-1 text-sm">{session.description ?? "-"}</p>
        </div>

        <div className="mt-4 rounded-md border border-border p-3">
          <div className="text-xs text-muted-foreground">Evaluation Status</div>
          <div className="mt-1 text-sm font-medium">{getEvaluationStatus(session)}</div>
          {session.evaluationNotes ? <p className="mt-2 text-sm text-muted-foreground">{session.evaluationNotes}</p> : null}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenEvaluation(session)}
            className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm"
          >
            Open Evaluation Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
