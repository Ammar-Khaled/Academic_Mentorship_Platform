import { useMemo } from "react";
import { useEvaluationSessions } from "./useEvaluationSessions";

export function useEvaluationDetails(sessionId) {
  const query = useEvaluationSessions();

  const session = useMemo(() => {
    return (query.data ?? []).find((item) => item._id === sessionId) ?? null;
  }, [query.data, sessionId]);

  return {
    ...query,
    data: session,
  };
}
