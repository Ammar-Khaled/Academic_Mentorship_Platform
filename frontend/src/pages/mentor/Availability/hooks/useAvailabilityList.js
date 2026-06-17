import { useQuery } from "@tanstack/react-query";
import { getMentorAvailability } from "@/api/mentor";
import { AVAILABILITY_QUERY_KEYS } from "../constants";

export function useAvailabilityList() {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.all,
    queryFn: getMentorAvailability,
  });
}
