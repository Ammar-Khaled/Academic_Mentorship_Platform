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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { TimeSlotPicker, addMinutes } from './time-slot-picker';
import { bookSessionSchema } from '@/lib/validations';
import { useBookSession } from '@/hooks/use-sessions';

export function BookSessionDialog({ mentor, children }) {
  const [open, setOpen] = useState(false);
  const bookMutation = useBookSession();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSessionSchema),
    defaultValues: { mentor: mentor?._id ?? mentor, date: undefined, startTime: '', description: '' },
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

    bookMutation.mutate(
      {
        mentor: values.mentor,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        description: values.description,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a review session</DialogTitle>
          <DialogDescription>Choose a date, a 45-minute slot, and describe what you need help with.</DialogDescription>
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
            <FieldLabel>Time slot (45 min)</FieldLabel>
            <TimeSlotPicker value={startTime} onChange={(slot) => setValue('startTime', slot, { shouldValidate: true })} />
            {errors.startTime && <FieldError>{errors.startTime.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>What do you need help with?</FieldLabel>
            <Textarea rows={3} placeholder="e.g. Reviewing my React project structure..." {...register('description')} />
            {errors.description && <FieldError>{errors.description.message}</FieldError>}
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={bookMutation.isPending} className="w-full">
              {bookMutation.isPending ? <Spinner className="mr-2 size-4" /> : null}
              Confirm booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
