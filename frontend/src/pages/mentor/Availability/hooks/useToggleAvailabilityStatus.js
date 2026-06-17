import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMentorAvailability } from "@/api/mentor";
import { AVAILABILITY_QUERY_KEYS } from "../constants";

export function useToggleAvailabilityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }) => updateMentorAvailability(id, { isActive }),
    onSuccess: (data) => {
      queryClient.setQueryData(AVAILABILITY_QUERY_KEYS.all, (old) => {
        if (!old) return old;
        return old.map((slot) => (slot._id === data._id ? data : slot));
      });
    },
  });
}