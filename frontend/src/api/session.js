import { api } from "@/lib/api";

// ─── Student session endpoints ─────────────────────────────────────────────

export const bookSession = (data) => api.post("/sessions/book", data).then((r) => r.data);

export const getUpcomingSessions = () => api.get("/sessions/student/upcoming").then((r) => r.data);

export const getSessionHistory = () => api.get("/sessions/student/history").then((r) => r.data);

export const cancelSession = (id) => api.patch(`/sessions/${id}/cancel`).then((r) => r.data);

export const rescheduleSession = (id, data) => api.patch(`/sessions/${id}/reschedule`, data).then((r) => r.data);

export const evaluateSession = (sessionId, data) => api.patch(`/sessions/${sessionId}/evaluate`, data).then((r) => r.data);

// ─── Mentor availability (public) ─────────────────────────────────────────

export const getMentorAvailability = (mentorId) => api.get(`/mentors/${mentorId}/availability`).then((r) => r.data);

export const getMentorBookedSlots = (mentorId, dateISO) =>
  api
    .get("/sessions/mentor-slots", { params: { mentorId, date: dateISO } })
    .then((r) => r.data)
    .catch(() => []);
