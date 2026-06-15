import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMentorProfile } from "@/api/mentor";
import { mentorProfileQueryKey } from "./useMentorProfile";
import { useMentorStore } from "@/stores/mentor.store";

export function useUpdateMentorProfile() {
  const qc = useQueryClient();
  const setProfile = useMentorStore((s) => s.setProfile);

  return useMutation({
    mutationFn: updateMentorProfile,
    onSuccess: (updated) => {
      qc.setQueryData(mentorProfileQueryKey, updated);
      setProfile(updated);
    },
  });
}
