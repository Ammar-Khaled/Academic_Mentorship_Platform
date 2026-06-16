import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { TimeSlotPicker, addMinutes } from './time-slot-picker';
import { rescheduleSchema } from '@/lib/validations';
import { useRescheduleSession } from '@/hooks/use-sessions';

export function RescheduleDialog({ session, open, onOpenChange }) {
  const rescheduleMutation = useRescheduleSession();

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: { date: undefined, startTime: '' },
  });

  const date = watch('date');
  const startTime = watch('startTime');

  function onSubmit(values) {
    const [h, m] = values.startTime.split(':').map(Number);
    const start = new Date(values.date);
    start.setHours(h, m, 0, 0);
    const endTimeStr = addMinutes(values.startTime, 45);
    const [eh, em] = endTimeStr.split(':').map(Number);
    const end = new Date(values.date);
    end.setHours(eh, em, 0, 0);

    rescheduleMutation.mutate(
      { id: session._id, startTime: start.toISOString(), endTime: end.toISOString() },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      }
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule session</DialogTitle>
          <DialogDescription>Pick a new date and time for this session.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => setValue('date', d, { shouldValidate: true })}
              disabled={{ before: today }}
              className="rounded-md border mx-auto"
            />
            {errors.date && <FieldError>{errors.date.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>New time slot</FieldLabel>
            <TimeSlotPicker value={startTime} onChange={(slot) => setValue('startTime', slot, { shouldValidate: true })} />
            {errors.startTime && <FieldError>{errors.startTime.message}</FieldError>}
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={rescheduleMutation.isPending} className="w-full">
              {rescheduleMutation.isPending ? <Spinner className="mr-2 size-4" /> : null}
              Confirm new time
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
