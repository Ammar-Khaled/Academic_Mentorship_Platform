import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookSession, cancelSession, getMentorAvailability, getMentorBookedSlots, getSessionHistory, getUpcomingSessions, rescheduleSession, evaluateSession } from "@/api/session";

// ─── Query key factory ─────────────────────────────────────────────────────

export const sessionKeys = {
  all: ["sessions"],
  upcoming: () => [...sessionKeys.all, "upcoming"],
  history: () => [...sessionKeys.all, "history"],
  mentorAvailability: (mentorId) => ["mentorAvailability", mentorId],
  mentorBookedSlots: (mentorId, date) => ["mentorBookedSlots", mentorId, date],
};

// ─── Student queries ───────────────────────────────────────────────────────

export function useUpcomingSessions() {
  return useQuery({
    queryKey: sessionKeys.upcoming(),
    queryFn: getUpcomingSessions,
  });
}

export function useSessionHistory() {
  return useQuery({
    queryKey: sessionKeys.history(),
    queryFn: getSessionHistory,
  });
}

// ─── Mentor availability (public) ─────────────────────────────────────────

export function useMentorAvailability(mentorId) {
  return useQuery({
    queryKey: sessionKeys.mentorAvailability(mentorId),
    queryFn: () => getMentorAvailability(mentorId),
    enabled: Boolean(mentorId),
    staleTime: 5 * 60 * 1000, // 5 min — availability rarely changes
  });
}
export function useMentorBookedSlots(mentorId, date) {
  // date must be a Date object or null
  const dateISO = date instanceof Date ? date.toISOString().split("T")[0] : null;

  return useQuery({
    queryKey: sessionKeys.mentorBookedSlots(mentorId, dateISO),
    queryFn: () => getMentorBookedSlots(mentorId, dateISO),
    enabled: Boolean(mentorId) && Boolean(dateISO),
    staleTime: 30 * 1000, // 30 s — bookings change frequently
  });
}

// ─── Mutations ─────────────────────────────────────────────────────────────

export function useBookSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookSession,
    onSuccess: () => {
      // Invalidate upcoming sessions so the list refreshes
      queryClient.invalidateQueries({ queryKey: sessionKeys.upcoming() });
      // Also invalidate booked-slots cache so the picker updates immediately
      queryClient.invalidateQueries({ queryKey: ["mentorBookedSlots"] });
    },
    onError: (error) => {
      const message = error?.response?.data?.message ?? "Failed to book session. Please try again.";
      toast.error(message);
    },
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.history() });
      queryClient.invalidateQueries({ queryKey: ["mentorBookedSlots"] });
      toast.success("Session cancelled successfully.");
    },
    onError: (error) => {
      const message = error?.response?.data?.message ?? "Failed to cancel session.";
      toast.error(message);
    },
  });
}

export function useRescheduleSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => rescheduleSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: ["mentorBookedSlots"] });
    },
    onError: (error) => {
      toast.error(message);
    },
  });
}

export function useEvaluateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => evaluateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.history() });
      toast.success("Session evaluated successfully.");
    },
    onError: (error) => {
      const message = error?.response?.data?.message ?? "Failed to evaluate session.";
      toast.error(message);
    },
  });
}
