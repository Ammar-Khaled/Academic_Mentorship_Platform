import { useQuery } from "@tanstack/react-query";
import { getStudentProfile } from "@/api/student";

export const studentProfileQueryKey = ["student", "profile"];

export function useStudentProfile() {
  return useQuery({
    queryKey: studentProfileQueryKey,
    queryFn: getStudentProfile,
  });
}
