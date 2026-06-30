import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { TimeSlotPicker, addMinutes } from "./time-slot-picker";
import { bookSessionSchema } from "@/lib/validations";
import { useBookSession, useMentorAvailability, useMentorBookedSlots } from "@/hooks/use-sessions";

function getWindowsForDate(availabilityData, date) {
  if (!availabilityData || !date) return [];
  const dayOfWeek = date.getDay();
  const dayEntry = availabilityData.find((entry) => entry.dayOfWeek === dayOfWeek);
  if (!dayEntry) return [];
  return dayEntry.slots.map((s) => ({ startTime: s.start, endTime: s.end }));
}

export function BookSessionDialog({ mentor, children }) {
  const [open, setOpen] = useState(false);

  const mentorId = mentor?._id ?? mentor;
  const bookMutation = useBookSession();

  const { data: availabilityData, isLoading: availabilityLoading } = useMentorAvailability(mentorId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSessionSchema),
    defaultValues: {
      mentor: mentorId,
      date: undefined,
      startTime: "",
      description: "",
    },
  });

  const date = watch("date");
  const startTime = watch("startTime");

  const { data: bookedRanges = [], isLoading: bookedLoading } = useMentorBookedSlots(mentorId, date ?? null);

  const availabilityWindows = getWindowsForDate(availabilityData, date);

  function handleDateChange(d) {
    setValue("date", d, { shouldValidate: true });
    setValue("startTime", "", { shouldValidate: false });
  }

  function onSubmit(values) {
    const [h, m] = values.startTime.split(":").map(Number);
    const start = new Date(values.date);
    start.setHours(h, m, 0, 0);

    const endTimeStr = addMinutes(values.startTime, 45);
    const [eh, em] = endTimeStr.split(":").map(Number);
    const end = new Date(values.date);
    end.setHours(eh, em, 0, 0);

    bookMutation.mutate(
      {
        mentor: values.mentor,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        description: values.description,
      },
      {
        onSuccess: () => {
          toast.success("Session booked successfully!");
          setOpen(false);
          reset();
        },
      },
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Book a review session</DialogTitle>
          <DialogDescription>Choose a date, pick an available 45-min slot, and add a description.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-auto px-0.5 pb-1">
          <input type="hidden" {...register("mentor")} />

          {/* ── Date ──────────────────────────────────────────────────── */}
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Calendar mode="single" selected={date} onSelect={handleDateChange} disabled={{ before: today }} className="rounded-md border mx-auto" />
            {errors.date && <FieldError>{errors.date.message}</FieldError>}
          </Field>

          {/* ── Time slot ─────────────────────────────────────────────── */}
          <Field>
            <FieldLabel>
              Time slot (45 min)
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

          {/* ── Description ───────────────────────────────────────────── */}
          <Field>
            <FieldLabel>What do you need help with?</FieldLabel>
            <Textarea rows={2} placeholder="e.g. Reviewing my React project structure..." {...register("description")} />
            {errors.description && <FieldError>{errors.description.message}</FieldError>}
          </Field>

          {/* ── Submit ────────────────────────────────────────────────── */}
          <DialogFooter className="flex-shrink-0 pt-2">
            <Button type="submit" disabled={bookMutation.isPending} className="w-full">
              {bookMutation.isPending && <Spinner className="mr-2 size-4" />}
              Confirm booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
