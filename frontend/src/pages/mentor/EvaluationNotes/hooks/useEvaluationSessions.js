import { useQuery } from "@tanstack/react-query";
import { getMentorSessions } from "@/api/mentor";
import { EVALUATION_QUERY_KEYS } from "../constants";

export function useEvaluationSessions() {
  return useQuery({
    queryKey: EVALUATION_QUERY_KEYS.sessions,
    queryFn: () => getMentorSessions({ page: 1, limit: 100, status: "Completed" }),
    select: (response) => response?.data ?? [],
  });
}
