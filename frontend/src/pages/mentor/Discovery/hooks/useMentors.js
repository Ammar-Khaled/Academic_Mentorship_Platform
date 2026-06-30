import { useEffect, useState } from "react";
import { getMentors } from "@/api/mentor";

export function useMentors({
  page = 1,
  keyword = "",
  sortBy = "",
  limit = 6,
} = {}) {
  const [loading, setLoading] = useState(true);

  const [mentors, setMentors] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadMentors();
  }, [page, keyword, sortBy, limit]);

  async function loadMentors() {
    try {
      setLoading(true);

      const result = await getMentors({
        page,
        limit,
        keyword,
        sort_by: sortBy,
      });

      setMentors(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }

  return {
    mentors,
    total,
    loading,
  };
}