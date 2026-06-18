import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/lib/api";
import { useMentorStore } from "@/stores/mentor.store.js";
import { useMentorSessions } from "./hooks/useMentorSessions";
import { useSessionFilters } from "./hooks/useSessionFilters";
import { filterSessionsByClientFilters } from "./utils";
import { SessionsHeader } from "./components/SessionsHeader";
import { SessionsFilters } from "./components/SessionsFilters";
import { SessionsTable } from "./components/SessionsTable";
import { SessionCard } from "./components/SessionCard";
import { SessionDetailsDialog } from "./components/SessionDetailsDialog";
import { SessionsSkeleton } from "./components/SessionsSkeleton";
import { SessionsEmptyState } from "./components/SessionsEmptyState";

export default function MentorSessionsPage() {
  const navigate = useNavigate();

  const {
    isSessionDetailsOpen,
    selectedSession,
    sessionFilters,
    openSessionDetails,
    closeSessionDetails,
    setSessionFilters,
  } = useMentorStore();

  const { queryParams } = useSessionFilters(sessionFilters);

  const sessionsQuery = useMentorSessions(queryParams);

  const sessions = sessionsQuery.data?.data ?? [];
  const pagination = {
    total: sessionsQuery.data?.total ?? 0,
    page: sessionsQuery.data?.page ?? sessionFilters.page,
    limit: sessionsQuery.data?.limit ?? sessionFilters.limit,
  };

  const visibleSessions = useMemo(
    () => filterSessionsByClientFilters(sessions, sessionFilters),
    [sessions, sessionFilters]
  );

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  function handleOpenEvaluation(session) {
    navigate("/mentor/evaluations");
    if (session?._id) {
      closeSessionDetails();
    }
  }

  if (sessionsQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <SessionsSkeleton />
      </div>
    );
  }

  if (sessionsQuery.isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {getErrorMessage(sessionsQuery.error)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="space-y-6">
        <SessionsHeader />

        <SessionsFilters
          filters={sessionFilters}
          onChange={setSessionFilters}
          onTabChange={(tab) => setSessionFilters({ tab, page: 1 })}
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {visibleSessions.length} of {pagination.total} sessions
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setSessionFilters({ page: pagination.page - 1 })}
              className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs text-muted-foreground">
              Page {pagination.page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= totalPages}
              onClick={() => setSessionFilters({ page: pagination.page + 1 })}
              className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {visibleSessions.length === 0 ? <SessionsEmptyState /> : null}

        {visibleSessions.length > 0 ? (
          <>
            <SessionsTable
              sessions={visibleSessions}
              onViewDetails={openSessionDetails}
              onOpenEvaluation={handleOpenEvaluation}
            />

            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {visibleSessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  onViewDetails={openSessionDetails}
                  onOpenEvaluation={handleOpenEvaluation}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <SessionDetailsDialog
        open={isSessionDetailsOpen}
        session={selectedSession}
        onClose={closeSessionDetails}
        onOpenEvaluation={handleOpenEvaluation}
      />
    </div>
  );
}
