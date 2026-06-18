import { z } from "zod";

export const evaluationSchema = z.object({
  evaluationNotes: z.string().trim().min(10, "Evaluation note must be at least 10 characters"),
});
