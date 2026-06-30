import { formatSessionDate, getStudentName } from "../utils";

export function EvaluationDetailsDialog({ session, open, onClose, onEdit }) {
  if (!open || !session) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-background p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Evaluation Details</h3>
            <p className="text-sm text-muted-foreground">Review session and feedback details.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-border px-2 py-1 text-xs">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1 rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Student</div>
            <div className="font-medium">{getStudentName(session)}</div>
          </div>
          <div className="space-y-1 rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Session Date</div>
            <div className="font-medium">{formatSessionDate(session.startTime)}</div>
          </div>
          <div className="space-y-1 rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Session Status</div>
            <div className="font-medium">{session.status ?? "-"}</div>
          </div>
          <div className="space-y-1 rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Rating</div>
            <div className="font-medium">{typeof session.rating === "number" ? session.rating : "-"}</div>
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-md border border-border p-3">
          <div className="text-xs text-muted-foreground">Feedback Notes</div>
          <p className="text-sm text-foreground">{session.evaluationNotes || "No notes provided yet."}</p>
        </div>
      </div>
    </div>
  );
}
