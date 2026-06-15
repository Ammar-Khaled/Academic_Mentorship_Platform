import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMentorProfile } from "@/api/mentor";
import { useMentorStore } from "@/stores/mentor.store";

export const mentorProfileQueryKey = ["mentor", "profile"];

export function useMentorProfile() {
  const setProfile = useMentorStore((s) => s.setProfile);

  const query = useQuery({
    queryKey: mentorProfileQueryKey,
    queryFn: getMentorProfile,
  });

  useEffect(() => {
    if (query.data) setProfile(query.data);
  }, [query.data, setProfile]);

  return query;
}
