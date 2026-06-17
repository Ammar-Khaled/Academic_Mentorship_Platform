import { useEffect, useState } from "react";
import { getMentors } from "@/api/mentor";

export function useMentors({
  page = 1,
  keyword = "",
  sortBy = "",
}) {
  const [loading, setLoading] = useState(true);

  const [mentors, setMentors] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadMentors();
  }, [page, keyword, sortBy]);

  async function loadMentors() {
    try {
      setLoading(true);

      const result = await getMentors({
        page,
        limit: 6,
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