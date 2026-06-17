export const SESSION_QUERY_KEYS = {
  all: ["mentor", "sessions", "workspace"],
};

export const SESSION_STATUS_TABS = [
  { value: "all", label: "All Sessions", statusParam: undefined },
  { value: "upcoming", label: "Upcoming", statusParam: "Scheduled" },
  { value: "completed", label: "Completed", statusParam: "Completed" },
  { value: "canceled", label: "Cancelled", statusParam: "Canceled" },
];

export const SESSION_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "InProgress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Canceled", label: "Cancelled" },
];
