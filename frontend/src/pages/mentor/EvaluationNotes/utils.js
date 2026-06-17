export function formatSessionDate(isoString) {
  if (!isoString) return "-";

  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
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

export function isCompletedSession(session) {
  return session?.status === "Completed";
}

export function hasEvaluationNote(session) {
  return Boolean(session?.evaluationNotes && String(session.evaluationNotes).trim());
}

export function getEvaluationStatus(session) {
  if (!isCompletedSession(session)) return "not-applicable";
  return hasEvaluationNote(session) ? "completed" : "pending";
}

export function filterEvaluationSessions(sessions, filters) {
  const { search = "", reviewStatus = "all", date = "" } = filters ?? {};

  return sessions.filter((session) => {
    if (!isCompletedSession(session)) {
      return false;
    }

    if (reviewStatus === "pending" && hasEvaluationNote(session)) {
      return false;
    }

    if (reviewStatus === "completed" && !hasEvaluationNote(session)) {
      return false;
    }

    if (search) {
      const studentName = getStudentName(session).toLowerCase();
      if (!studentName.includes(search.toLowerCase())) {
        return false;
      }
    }

    if (date) {
      const sessionDate = new Date(session?.startTime);
      const selectedDate = new Date(date);

      if (sessionDate.getFullYear() !== selectedDate.getFullYear() || sessionDate.getMonth() !== selectedDate.getMonth() || sessionDate.getDate() !== selectedDate.getDate()) {
        return false;
      }
    }

    return true;
  });
}

export function buildEvaluationStats(sessions) {
  const completedSessions = sessions.filter((s) => s.status === "Completed");
  const pendingReviews = completedSessions.filter((s) => !hasEvaluationNote(s));
  const completedReviews = completedSessions.filter((s) => hasEvaluationNote(s));
  const ratings = completedSessions.filter((s) => typeof s.rating === "number").map((s) => s.rating);

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  const reviewsThisWeek = completedReviews.filter((s) => {
    if (!s.evaluatedAt) return false;
    const evaluatedDate = new Date(s.evaluatedAt);
    return evaluatedDate >= oneWeekAgo;
  }).length;

  return {
    pendingReviews: pendingReviews.length,
    completedReviews: completedReviews.length,
    averageRating: ratings.length > 0 ? Math.round((ratings.reduce((sum, value) => sum + value, 0) / ratings.length) * 10) / 10 : null,
    reviewsThisWeek,
  };
}
