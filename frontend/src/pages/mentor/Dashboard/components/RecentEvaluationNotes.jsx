import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSessionDate } from "../utils";

export function RecentEvaluationNotes({ sessions = [] }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Recent Evaluation Notes</CardTitle>
          <CardDescription>Latest feedback you've written for completed sessions.</CardDescription>
        </div>

        <Button variant="outline" size="sm" onClick={() => navigate("/mentor/evaluations")}>
          View all
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">No evaluation notes yet.</div>
          ) : (
            sessions.map((s) => (
              <div key={s._id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{s.student?.name ?? "Unknown student"}</div>
                    <div className="text-xs text-muted-foreground">{formatSessionDate(s.evaluatedAt ?? s.startTime)}</div>
                  </div>
                  {typeof s.rating === "number" ? (
                    <Badge variant="secondary" className="shrink-0">
                      {s.rating}/5
                    </Badge>
                  ) : null}
                </div>

                {s.evaluationNotes ? <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{s.evaluationNotes}</p> : null}

                <div className="mt-3 flex items-center justify-end">
                  <Button size="sm" variant="secondary" onClick={() => navigate("/mentor/evaluations")}>
                    Open note
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
