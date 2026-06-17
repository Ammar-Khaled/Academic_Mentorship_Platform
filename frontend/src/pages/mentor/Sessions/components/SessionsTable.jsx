import { getEvaluationStatus, getStudentName, formatSessionDate } from "../utils";
import { SessionStatusBadge } from "./SessionStatusBadge";

export function SessionsTable({ sessions, onViewDetails, onOpenEvaluation }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Session Date</th>
            <th className="px-4 py-3">Time Range</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Evaluation</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session._id} className="border-b border-border">
              <td className="px-4 py-3 font-medium">{getStudentName(session)}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatSessionDate(session.startTime)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatSessionDate(session.startTime)} - {formatSessionDate(session.endTime)}
              </td>
              <td className="px-4 py-3">
                <SessionStatusBadge status={session.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{getEvaluationStatus(session)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
