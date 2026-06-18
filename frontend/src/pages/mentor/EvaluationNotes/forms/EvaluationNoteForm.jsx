import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { evaluationSchema } from "../schemas/evaluation.schema";

export function EvaluationNoteForm({ defaultValues, isSubmitting, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      evaluationNotes: defaultValues?.evaluationNotes ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset({ evaluationNotes: defaultValues?.evaluationNotes ?? "" });
  }, [defaultValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label htmlFor="evaluationNotes" className="text-sm font-medium">
          Feedback Notes
        </label>
        <textarea
          id="evaluationNotes"
          rows={6}
          className="w-full rounded-md border border-border bg-background p-3 text-sm"
          placeholder="Write technical feedback and assessment notes"
          {...register("evaluationNotes")}
        />
        {errors.evaluationNotes?.message ? (
          <p className="text-xs text-destructive">{errors.evaluationNotes.message}</p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Evaluation"}
        </button>
      </div>
    </form>
  );
}
