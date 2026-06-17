import { AvailabilityForm } from "../forms/AvailabilityForm";

export function AvailabilityDialog({ open, title, description, submitLabel, errorMessage, isSubmitting, defaultValues, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-background p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <button type="button" onClick={onClose} className="rounded-md border border-border px-2 py-1 text-xs">
            Close
          </button>
        </div>

        {errorMessage ? <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{errorMessage}</div> : null}

        <AvailabilityForm defaultValues={defaultValues} submitLabel={submitLabel} isSubmitting={isSubmitting} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
