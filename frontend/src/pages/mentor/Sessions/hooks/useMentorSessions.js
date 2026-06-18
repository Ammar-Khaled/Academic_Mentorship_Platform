import { useQuery } from "@tanstack/react-query";
import { getMentorSessions } from "@/api/mentor";
import { SESSION_QUERY_KEYS } from "../constants";

export function useMentorSessions(params) {
  return useQuery({
    queryKey: [...SESSION_QUERY_KEYS.all, params],
    queryFn: () => getMentorSessions(params),
  });
}
