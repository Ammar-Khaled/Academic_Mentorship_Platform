import { useMutation, useQueryClient } from "@tanstack/react-query";
import { evaluateMentorSession } from "@/api/mentor";
import { EVALUATION_QUERY_KEYS } from "../constants";

export function useCreateEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, payload }) => evaluateMentorSession(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVALUATION_QUERY_KEYS.sessions });
    },
  });
}
