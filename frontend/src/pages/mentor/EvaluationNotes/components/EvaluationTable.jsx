import { formatSessionDate, getStudentName, hasEvaluationNote } from "../utils";

export function EvaluationTable({ sessions = [], onView, onEdit }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Session Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const reviewed = hasEvaluationNote(session);

            return (
              <tr key={session._id} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{getStudentName(session)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatSessionDate(session.startTime)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${reviewed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{reviewed ? "Completed" : "Pending"}</span>
                </td>
                <td className="px-4 py-3">{typeof session.rating === "number" ? session.rating : "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onView(session)} className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium">
                      View
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
