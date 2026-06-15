// ─── UI Copy ──────────────────────────────────────────────────────────────────

export const DASHBOARD_COPY = {
  title: "Mentor Dashboard",
  subtitle: "Overview of your sessions, availability, and recent evaluations.",
};

// ─── Backend Enums (mirrors ReviewSessionStatus) ──────────────────────────────

export const ReviewSessionStatus = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "InProgress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// ─── Status → Badge label ─────────────────────────────────────────────────────

export const SESSION_STATUS_LABELS = {
  [ReviewSessionStatus.SCHEDULED]: "Scheduled",
  [ReviewSessionStatus.IN_PROGRESS]: "In Progress",
  [ReviewSessionStatus.COMPLETED]: "Completed",
  [ReviewSessionStatus.CANCELLED]: "Cancelled",
};

// ─── Status → Shadcn Badge variant ────────────────────────────────────────────

export const SESSION_STATUS_VARIANTS = {
  [ReviewSessionStatus.SCHEDULED]: "secondary",
  [ReviewSessionStatus.IN_PROGRESS]: "default",
  [ReviewSessionStatus.COMPLETED]: "outline",
  [ReviewSessionStatus.CANCELLED]: "destructive",
};

// ─── Day names (0 = Sunday … 6 = Saturday) ───────────────────────────────────

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── TanStack Query Keys ──────────────────────────────────────────────────────

export const DASHBOARD_QUERY_KEYS = {
  all: ["mentor", "dashboard"],
  sessionStats: () => [...DASHBOARD_QUERY_KEYS.all, "stats"],
  upcomingSessions: () => [...DASHBOARD_QUERY_KEYS.all, "upcoming-sessions"],
  recentEvaluations: () => [...DASHBOARD_QUERY_KEYS.all, "recent-evaluations"],
  weeklyAvailability: () => [...DASHBOARD_QUERY_KEYS.all, "availability"],
};
