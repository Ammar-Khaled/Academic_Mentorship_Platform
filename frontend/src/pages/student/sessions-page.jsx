import { useState } from "react";
import { toast } from "sonner";
import { BookSessionDialog } from "@/components/sessions/book-session-dialog";
import { RescheduleDialog } from "@/components/sessions/reschedule-dialog";
import { EvaluateSessionDialog } from "@/components/sessions/evaluate-session-dialog";
import { SessionCard } from "@/components/sessions/session-card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCancelSession, useRescheduleSession, useSessionHistory, useUpcomingSessions } from "@/hooks/use-sessions";
import { Button } from "@/components/ui/button";

export default function StudentSessionsPage() {
  const [reschedulingSession, setReschedulingSession] = useState(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: upcoming = [], isLoading: upcomingLoading, error: upcomingError } = useUpcomingSessions();

  const { data: history = [], isLoading: historyLoading, error: historyError } = useSessionHistory();

  // ── Mutations ─────────────────────────────────────────────────────────────
  const cancelMutation = useCancelSession();
  const rescheduleMutation = useRescheduleSession();

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleCancel(sessionId) {
    cancelMutation.mutate(sessionId);
  }

  function handleRescheduleOpen(session) {
    setReschedulingSession(session);
  }

  function handleRescheduleSubmit(payload) {
    if (!reschedulingSession) return;

    rescheduleMutation.mutate(
      { id: reschedulingSession._id, ...payload },
      {
        onSuccess: () => {
          toast.success("Session rescheduled successfully!");
          setReschedulingSession(null);
        },
        onError: (error) => {
          const message = error?.response?.data?.message ?? "Failed to reschedule session.";
          toast.error(message);
        },
      },
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Sessions</h1>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">
            Upcoming
            {upcoming.length > 0 && <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-medium text-primary-foreground">{upcoming.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            History
          </TabsTrigger>
        </TabsList>

        {/* ── Upcoming ──────────────────────────────────────────────────── */}
        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcomingLoading && (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          )}

          {upcomingError && <p className="py-6 text-center text-sm text-destructive">Failed to load upcoming sessions.</p>}

          {!upcomingLoading && !upcomingError && upcoming.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No upcoming sessions. Book one below!</p>}

          {upcoming.map((session) => (
            <SessionCard key={session._id} session={session} showActions onReschedule={handleRescheduleOpen} onCancel={handleCancel} />
          ))}
        </TabsContent>

        {/* ── History ───────────────────────────────────────────────────── */}
        <TabsContent value="history" className="mt-4 space-y-3">
          {historyLoading && (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          )}

          {historyError && <p className="py-6 text-center text-sm text-destructive">Failed to load session history.</p>}

          {!historyLoading && !historyError && history.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No past sessions yet.</p>}

          {history.map((session) => (
            <SessionCard key={session._id} session={session} showActions={false} showEvaluate={true} />
          ))}
        </TabsContent>
      </Tabs>

      {/* ── Reschedule dialog (controlled externally) ──────────────────────── */}
      {reschedulingSession && (
        <RescheduleDialog
          session={reschedulingSession}
          onReschedule={handleRescheduleSubmit}
          open={Boolean(reschedulingSession)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setReschedulingSession(null);
          }}
        />
      )}
    </div>
  );
}
