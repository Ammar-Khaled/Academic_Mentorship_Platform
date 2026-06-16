import { z } from 'zod';

export const bookSessionSchema = z
  .object({
    mentor: z.string().min(1, 'Select a mentor'),
    date: z.date({ required_error: 'Pick a date' }),
    startTime: z.string().min(1, 'Pick a start time'),
    description: z.string().min(10, 'Describe what you need help with').max(500),
  })
  .refine((data) => data.date && data.startTime, { message: 'Pick a slot' });

export const rescheduleSchema = z.object({
  date: z.date({ required_error: 'Pick a date' }),
  startTime: z.string().min(1, 'Pick a start time'),
});
