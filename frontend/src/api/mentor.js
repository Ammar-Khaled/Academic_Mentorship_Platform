import { api } from "@/lib/api";

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getMentorProfile() {
  const { data } = await api.get("/mentor/profile");
  return data;
}

export async function updateMentorProfile(payload) {
  const { data } = await api.patch("/mentor/profile", payload);
  return data;
}

// ─── Mentors ─────────────────────────────────────────────────────────────
export async function getMentors(params = {}) {
  const { data } = await api.get("/mentors", {
    params,
  });

  return data;
}


export async function getMentor(id) {
  const { data } = await api.get(`/mentors/${id}`);
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

export async function getPublicMentorAvailability(id) {
  const { data } = await api.get(`/mentors/${id}/availability`);
  return data;
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

export async function evaluateMentorSession(sessionId, payload) {
  const { data } = await api.patch(`/mentor/sessions/${sessionId}/evaluation`, payload);
  return data;
}
