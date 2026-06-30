import { api } from "@/lib/api";

export async function getStudentProfile() {
  const { data } = await api.get("/students/me");
  return data;
}

export async function updateStudentProfile(payload) {
  const { data } = await api.patch("/students/me", payload);
  return data;
}
