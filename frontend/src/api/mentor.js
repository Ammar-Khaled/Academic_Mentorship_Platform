import api from "@/lib/api";

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getMentorProfile() {
  const { data } = await api.get("/mentor/profile");
  return data;
}

export async function updateMentorProfile(payload) {
  const { data } = await api.patch("/mentor/profile", payload);
  return data;
}

// ─── Availability ─────────────────────────────────────────────────────────────

export async function getMentorAvailability() {
  const { data } = await api.get("/mentor/availability");
  return data;
}

export async function createMentorAvailability(payload) {
  const { data } = await api.post("/mentor/availability", payload);
  return data;
}

export async function updateMentorAvailability(id, payload) {
  const { data } = await api.patch(`/mentor/availability/${id}`, payload);
  return data;
}

export async function deleteMentorAvailability(id) {
  const { data } = await api.delete(`/mentor/availability/${id}`);
  return data;
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

/**
 * @param {{ status?: string, page?: number, limit?: number }} params
 */
export async function getMentorSessions(params = {}) {
  const { data } = await api.get("/mentor/sessions", { params });
  return data; // { data: [], total, page, limit }
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

export async function evaluateMentorSession(sessionId, payload) {
  const { data } = await api.patch(`/mentor/sessions/${sessionId}/evaluation`, payload);
  return data;
}
