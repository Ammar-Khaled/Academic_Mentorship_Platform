import { useQuery } from "@tanstack/react-query";
import { getMentorSessions } from "@/api/mentor";
import { DASHBOARD_QUERY_KEYS } from "../constants";
import { ReviewSessionStatus } from "../constants";

/**
 * Derives dashboard statistics from the sessions endpoint.
 * Returns: { totalSessions, upcomingSessions, completedReviews, averageRating }
 */
export function useDashboardStats() {
  // Fetch all sessions (high limit to count totals)
  const {
    data: allSessions,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.sessionStats(),
    queryFn: () => getMentorSessions({ limit: 100 }),
    staleTime: 1000 * 60 * 2,
  });

  const sessions = allSessions?.data ?? [];

  const totalSessions = allSessions?.total ?? 0;

  const upcomingSessions = sessions.filter((s) => s.status === ReviewSessionStatus.SCHEDULED).length;

  const completedSessions = sessions.filter((s) => s.status === ReviewSessionStatus.COMPLETED);

  const completedReviews = sessions.filter((s) => s.status === ReviewSessionStatus.COMPLETED && s.evaluationNotes).length;

  const ratings = completedSessions.filter((s) => typeof s.rating === "number").map((s) => s.rating);

  const averageRating = ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0;

  return {
    stats: { totalSessions, upcomingSessions, completedReviews, averageRating },
    isLoading: isLoadingAll,
    error: errorAll,
  };
}
