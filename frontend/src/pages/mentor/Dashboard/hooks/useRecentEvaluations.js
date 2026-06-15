import { useQuery } from "@tanstack/react-query";
import { getMentorSessions } from "@/api/mentor";
import { DASHBOARD_QUERY_KEYS, ReviewSessionStatus } from "../constants";

/**
 * Fetches recently completed sessions that have evaluation notes.
 */
export function useRecentEvaluations() {
  const { data, isLoading, error } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.recentEvaluations(),
    queryFn: () =>
      getMentorSessions({
        status: ReviewSessionStatus.COMPLETED,
        page: 1,
        limit: 5,
      }),
    staleTime: 1000 * 60 * 2,
  });

  // Only show sessions that actually have evaluation notes written
  const sessions = (data?.data ?? []).filter((s) => s.evaluationNotes);

  return {
    sessions,
    isLoading,
    error,
  };
}
