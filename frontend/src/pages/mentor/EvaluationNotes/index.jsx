import { useMemo } from "react";
import { getErrorMessage } from "@/lib/api";
import { useMentorStore } from "@/stores/mentor.store.js";

import { useEvaluationSessions } from "./hooks/useEvaluationSessions";
import { useCreateEvaluation } from "./hooks/useCreateEvaluation";
import { useUpdateEvaluation } from "./hooks/useUpdateEvaluation";

import { buildEvaluationStats, filterEvaluationSessions } from "./utils";
import { EvaluationHeader } from "./components/EvaluationHeader";
import { EvaluationStats } from "./components/EvaluationStats";
import { EvaluationFilters } from "./components/EvaluationFilters";
import { EvaluationTable } from "./components/EvaluationTable";
import { EvaluationCard } from "./components/EvaluationCard";
import { EvaluationDetailsDialog } from "./components/EvaluationDetailsDialog";
import { EvaluationEmptyState } from "./components/EvaluationEmptyState";
import { EvaluationSkeleton } from "./components/EvaluationSkeleton";
import { EvaluationNoteForm } from "./forms/EvaluationNoteForm";

function EvaluationFormDialog({ open, session, errorMessage, isSubmitting, onClose, onSubmit }) {
  if (!open || !session) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-background p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{session.evaluationNotes ? "Edit Evaluation" : "Add Evaluation"}</h3>
            <p className="text-sm text-muted-foreground">Submit feedback for this completed session.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-border px-2 py-1 text-xs">
            Close
          </button>
        </div>

        {errorMessage ? <div className="mb-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{errorMessage}</div> : null}

        <EvaluationNoteForm defaultValues={{ evaluationNotes: session.evaluationNotes ?? "" }} isSubmitting={isSubmitting} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default function MentorEvaluationNotesPage() {
  const { isEvaluationDetailsOpen, isEvaluationFormOpen, selectedEvaluation, evaluationFilters, openEvaluationDetails, closeEvaluationDetails, openEvaluationForm, closeEvaluationForm, setEvaluationFilters } = useMentorStore();

  const sessionsQuery = useEvaluationSessions();
  const createMutation = useCreateEvaluation();
  const updateMutation = useUpdateEvaluation();

  const safeFilters = evaluationFilters ?? {
    search: "",
    reviewStatus: "all",
    date: "",
  };

  const sessions = sessionsQuery.data ?? [];
  const filteredSessions = useMemo(() => filterEvaluationSessions(sessions, safeFilters), [sessions, safeFilters]);
  const stats = useMemo(() => buildEvaluationStats(sessions), [sessions]);

  function handleSave(values) {
    if (!selectedEvaluation?._id) return;

    const mutation = selectedEvaluation.evaluationNotes ? updateMutation : createMutation;

    mutation.mutate(
      {
        sessionId: selectedEvaluation._id,
        payload: {
          evaluationNotes: values.evaluationNotes,
        },
      },
      {
        onSuccess: () => {
          closeEvaluationForm();
        },
      },
    );
  }

  if (sessionsQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <EvaluationSkeleton />
      </div>
    );
  }

  if (sessionsQuery.isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{getErrorMessage(sessionsQuery.error)}</div>
      </div>
    );
  }

  const mutationError = createMutation.error || updateMutation.error;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="space-y-6">
        <EvaluationHeader />
        <EvaluationStats stats={stats} />

        <EvaluationFilters filters={safeFilters} onChange={setEvaluationFilters} />

        {filteredSessions.length === 0 ? (
          <EvaluationEmptyState />
        ) : (
          <>
            <EvaluationTable sessions={filteredSessions} onView={(session) => openEvaluationDetails(session)} onEdit={(session) => openEvaluationForm(session)} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredSessions.slice(0, 6).map((session) => (
                <EvaluationCard key={session._id} session={session} onView={(item) => openEvaluationDetails(item)} onEdit={(item) => openEvaluationForm(item)} />
              ))}
            </div>
          </>
        )}
      </div>

      <EvaluationDetailsDialog
        open={isEvaluationDetailsOpen}
        session={selectedEvaluation}
        onClose={closeEvaluationDetails}
        onEdit={(session) => {
          closeEvaluationDetails();
          openEvaluationForm(session);
        }}
      />

      <EvaluationFormDialog
        open={isEvaluationFormOpen}
        session={selectedEvaluation}
        errorMessage={mutationError ? getErrorMessage(mutationError) : null}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={closeEvaluationForm}
        onSubmit={handleSave}
      />
    </div>
  );
}
