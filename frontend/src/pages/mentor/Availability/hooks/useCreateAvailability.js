import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMentorAvailability } from "@/api/mentor";
import { AVAILABILITY_QUERY_KEYS } from "../constants";

export function useCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMentorAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEYS.all });
    },
  });
}
