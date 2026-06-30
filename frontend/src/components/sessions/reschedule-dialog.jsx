import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { TimeSlotPicker, addMinutes } from "./time-slot-picker";
import { rescheduleSchema } from "@/lib/validations";
import { useMentorAvailability, useMentorBookedSlots, useRescheduleSession } from "@/hooks/use-sessions";

function getWindowsForDate(availabilityData, date) {
  if (!availabilityData || !date) return [];
  const dayOfWeek = date.getDay();
  const dayEntry = availabilityData.find((e) => e.dayOfWeek === dayOfWeek);
  if (!dayEntry) return [];
  return dayEntry.slots.map((s) => ({ startTime: s.start, endTime: s.end }));
}

export function RescheduleDialog({ session, onReschedule, children, open: controlledOpen, onOpenChange: controlledOnOpenChange }) {
  const isControlled = controlledOpen !== undefined;
  const mentorId = session?.mentor?._id ?? session?.mentor;

  const rescheduleMutation = useRescheduleSession();

  const { data: availabilityData, isLoading: availabilityLoading } = useMentorAvailability(mentorId);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: { date: undefined, startTime: "" },
  });

  const date = watch("date");
  const startTime = watch("startTime");

  const { data: bookedRangesRaw = [], isLoading: bookedLoading } = useMentorBookedSlots(mentorId, date ?? null);

  // Filter out the current session's own slot
  const bookedRanges = bookedRangesRaw.filter((range) => {
    if (!session?.startTime) return true;
    return new Date(range.startTime).getTime() !== new Date(session.startTime).getTime();
  });

  const availabilityWindows = getWindowsForDate(availabilityData, date);

  useEffect(() => {
    if (isControlled && !controlledOpen) {
      reset();
    }
  }, [controlledOpen, isControlled, reset]);

  function handleDateChange(d) {
    setValue("date", d, { shouldValidate: true });
    setValue("startTime", "", { shouldValidate: false });
  }

  function closeDialog() {
    if (isControlled) {
      controlledOnOpenChange?.(false);
    }
    reset();
  }

  function onSubmit(values) {
    const [h, m] = values.startTime.split(":").map(Number);
    const start = new Date(values.date);
    start.setHours(h, m, 0, 0);

    const endTimeStr = addMinutes(values.startTime, 45);
    const [eh, em] = endTimeStr.split(":").map(Number);
    const end = new Date(values.date);
    end.setHours(eh, em, 0, 0);

    const payload = {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    if (onReschedule) {
      try {
        onReschedule(payload);
        closeDialog();
      } catch {
        // parent handles error
      }
      return;
    }

    rescheduleMutation.mutate(
      { id: session._id, ...payload },
      {
        onSuccess: () => {
          toast.success("Session rescheduled successfully!");
          closeDialog();
        },
      },
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPending = rescheduleMutation.isPending;

  const dialogProps = isControlled ? { open: controlledOpen, onOpenChange: controlledOnOpenChange } : {};

  return (
    <Dialog {...dialogProps}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Reschedule session</DialogTitle>
          <DialogDescription>Pick a new date and time.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-auto px-0.5 pb-1">
          {/* ── Date ──────────────────────────────────────────────────── */}
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Calendar mode="single" selected={date} onSelect={handleDateChange} disabled={{ before: today }} className="rounded-md border mx-auto" />
            {errors.date && <FieldError>{errors.date.message}</FieldError>}
          </Field>

          {/* ── Time slot ─────────────────────────────────────────────── */}
          <Field>
            <FieldLabel>
              New time slot
              {date && <span className="ml-1.5 text-xs font-normal text-muted-foreground">— {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>}
            </FieldLabel>

            {!date ? (
              <p className="py-2 text-center text-sm text-muted-foreground">Select a date first.</p>
            ) : (
              <TimeSlotPicker
                value={startTime}
                onChange={(slot) => setValue("startTime", slot, { shouldValidate: true })}
                availabilityWindows={availabilityWindows}
                bookedRanges={bookedRanges}
                selectedDate={date}
                loading={availabilityLoading || bookedLoading}
              />
            )}
            {errors.startTime && <FieldError>{errors.startTime.message}</FieldError>}
          </Field>

          {/* ── Submit ────────────────────────────────────────────────── */}
          <DialogFooter className="flex-shrink-0 pt-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Spinner className="mr-2 size-4" />}
              Confirm new time
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
