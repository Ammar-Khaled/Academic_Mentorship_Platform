import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  title: z.string().min(2, "Title is too short"),
  bio: z.string().min(20, "Bio should be at least 20 characters"),
  hourlyRate: z.coerce.number().min(0, "Hourly rate must be 0 or more"),
});
