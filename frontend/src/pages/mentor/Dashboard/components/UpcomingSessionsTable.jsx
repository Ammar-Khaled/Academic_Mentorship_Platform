import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SESSION_STATUS_LABELS, SESSION_STATUS_VARIANTS } from "../constants";
import { formatSessionDate } from "../utils";

export function UpcomingSessionsTable({ sessions = [] }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your next scheduled sessions and items pending review.</CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/mentor/sessions")}
        >
          View all
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">Date</TableHead>
                <TableHead className="min-w-[160px]">Student</TableHead>
                <TableHead className="min-w-[220px]">Topic</TableHead>
                <TableHead className="min-w-[140px]">Status</TableHead>
                <TableHead className="w-[1%]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No upcoming sessions.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell className="font-medium">
                      {formatSessionDate(s.startTime)}
                    </TableCell>
                    <TableCell>{s.student?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{s.topic ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={SESSION_STATUS_VARIANTS[s.status] ?? "secondary"}>
                        {SESSION_STATUS_LABELS[s.status] ?? s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/mentor/sessions`)}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}