import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, Clock01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { EvaluateSessionDialog } from "./evaluate-session-dialog";

const STATUS_VARIANT = {
  Scheduled: "secondary",
  InProgress: "secondary",
  Completed: "outline",
  Canceled: "destructive",
};

export function SessionCard({ session, onReschedule, onCancel, showActions = true, showEvaluate = false }) {
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base">{session.mentor?.name ?? "Mentor"}</CardTitle>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} className="size-3.5" />
              {start.toLocaleDateString()}
            </span>

            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-3.5" />
              {start.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              –{" "}
              {end.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={STATUS_VARIANT[session.status] ?? "secondary"} className="capitalize">
            {session.status}
          </Badge>

          {showEvaluate && session.status === "Scheduled" && (
            <EvaluateSessionDialog session={session}>
              <Button size="sm" variant="outline" className="h-8">Evaluate</Button>
            </EvaluateSessionDialog>
          )}

          {/* Only show actions for Scheduled sessions */}
          {showActions && session.status === "Scheduled" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={2} className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onReschedule(session)}>Reschedule</DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                      Cancel
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
                      <AlertDialogDescription>This will free up the slot and notify your mentor. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep session</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onCancel(session._id)}>Yes, cancel</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      {session.description && <CardContent className="pt-0 text-sm text-muted-foreground">{session.description}</CardContent>}
    </Card>
  );
}
