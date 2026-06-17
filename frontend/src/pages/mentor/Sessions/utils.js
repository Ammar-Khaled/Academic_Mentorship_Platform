export function formatSessionDate(isoString) {
  if (!isoString) return "-";

  try {
    return new Date(isoString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return String(isoString);
  }
}

export function getStudentName(session) {
  return session?.student?.name ?? "Unknown student";
}

export function getEvaluationStatus(session) {
  if (session?.status !== "Completed") return "Not Available";
  return session?.evaluationNotes ? "Completed" : "Pending";
}

export function filterSessionsByClientFilters(sessions = [], filters = {}) {
  const { search = "", startDate = "", endDate = "", status = "all" } = filters;

  return sessions.filter((session) => {
    if (status !== "all" && session?.status !== status) {
      return false;
    }

    if (search) {
      const studentName = getStudentName(session).toLowerCase();
      if (!studentName.includes(search.toLowerCase())) {
        return false;
      }
    }

    if (startDate) {
      const current = new Date(session?.startTime);
      const start = new Date(startDate);
      if (current < start) {
        return false;
      }
    }

    if (endDate) {
      const current = new Date(session?.startTime);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (current > end) {
        return false;
      }
    }

    return true;
  });
}
