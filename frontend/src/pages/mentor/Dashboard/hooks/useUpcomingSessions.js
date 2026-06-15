import { useQuery } from "@tanstack/react-query";
import { getMentorSessions } from "@/api/mentor";
import { DASHBOARD_QUERY_KEYS, ReviewSessionStatus } from "../constants";

/**
 * Fetches upcoming (scheduled) sessions for the dashboard table.
 */
export function useUpcomingSessions() {
  const { data, isLoading, error } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.upcomingSessions(),
    queryFn: () =>
      getMentorSessions({
        status: ReviewSessionStatus.SCHEDULED,
        page: 1,
        limit: 5,
      }),
    staleTime: 1000 * 60 * 2,
  });

  return {
    sessions: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
  };
}
