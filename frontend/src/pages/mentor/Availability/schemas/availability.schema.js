import { z } from "zod";
import { timeToMinutes } from "../utils";

const hhmmRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const availabilitySchema = z
  .object({
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startTime: z.string().regex(hhmmRegex, "Use HH:mm"),
    endTime: z.string().regex(hhmmRegex, "Use HH:mm"),
    isActive: z.boolean().optional().default(true),
  })
  .refine((value) => timeToMinutes(value.startTime) < timeToMinutes(value.endTime), {
    path: ["endTime"],
    message: "End time must be later than start time",
  });
