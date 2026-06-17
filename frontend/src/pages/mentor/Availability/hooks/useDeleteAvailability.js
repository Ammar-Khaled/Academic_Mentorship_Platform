import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMentorAvailability } from "@/api/mentor";
import { AVAILABILITY_QUERY_KEYS } from "../constants";

export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMentorAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEYS.all });
    },
  });
}
