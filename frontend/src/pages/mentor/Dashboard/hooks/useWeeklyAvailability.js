import { useQuery } from "@tanstack/react-query";
import { getMentorAvailability } from "@/api/mentor";
import { DASHBOARD_QUERY_KEYS } from "../constants";

/**
 * Fetches the mentor's availability slots for the weekly preview.
 */
export function useWeeklyAvailability() {
  const { data, isLoading, error } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.weeklyAvailability(),
    queryFn: getMentorAvailability,
    staleTime: 1000 * 60 * 5,
  });

  return {
    availability: data ?? [],
    isLoading,
    error,
  };
}
