import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMentorAvailability } from "@/api/mentor";
import { AVAILABILITY_QUERY_KEYS } from "../constants";

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateMentorAvailability(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEYS.all });
    },
  });
}
