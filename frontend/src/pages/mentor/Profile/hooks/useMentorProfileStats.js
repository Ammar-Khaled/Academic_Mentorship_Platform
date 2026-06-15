import { useQuery } from "@tanstack/react-query";
import { getMentorAvailability, getMentorSessions } from "@/api/mentor";

export function useMentorProfileStats() {
  const availabilityQuery = useQuery({
    queryKey: ["mentor", "availability"],
    queryFn: getMentorAvailability,
  });

  const totalSessionsQuery = useQuery({
    queryKey: ["mentor", "sessions", "total"],
    queryFn: () => getMentorSessions({ page: 1, limit: 1 }),
  });

  return {
    availabilityQuery,
    totalSessionsQuery,
  };
}
