import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilitySchema } from "../schemas/availability.schema";
import { DAY_OPTIONS } from "../constants";

const defaultFormValues = {
  dayOfWeek: 1,
  startTime: "09:00",
  endTime: "10:00",
  isActive: true,
};

export function AvailabilityForm({ defaultValues, submitLabel, isSubmitting, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: defaultValues ?? defaultFormValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="dayOfWeek">
          Day
        </label>
        <select id="dayOfWeek" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" {...register("dayOfWeek", { valueAsNumber: true })}>
          {DAY_OPTIONS.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
        {errors.dayOfWeek?.message ? <p className="text-xs text-destructive">{errors.dayOfWeek.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="startTime">
            Start Time
          </label>
          <input id="startTime" type="time" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" {...register("startTime")} />
          {errors.startTime?.message ? <p className="text-xs text-destructive">{errors.startTime.message}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="endTime">
            End Time
          </label>
          <input id="endTime" type="time" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" {...register("endTime")} />
          {errors.endTime?.message ? <p className="text-xs text-destructive">{errors.endTime.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="isActive">
          Status
        </label>
        <select id="isActive" className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" {...register("isActive", { valueAsBoolean: true })}>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        {errors.isActive?.message ? <p className="text-xs text-destructive">{errors.isActive.message}</p> : null}
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background disabled:opacity-60">
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
