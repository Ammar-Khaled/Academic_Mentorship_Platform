// src/hooks/use-sessions.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sessionApi } from '@/api/session';
import { getErrorMessage } from '@/lib/api';

export function useUpcomingSessions() {
  return useQuery({
    queryKey: ['sessions', 'upcoming'],
    queryFn: async () => (await sessionApi.upcoming()).data,
  });
}

export function useSessionHistory() {
  return useQuery({
    queryKey: ['sessions', 'history'],
    queryFn: async () => (await sessionApi.history()).data,
  });
}

export function useBookSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => sessionApi.book(payload),
    onSuccess: () => {
      toast.success('Session booked successfully');
      qc.invalidateQueries({ queryKey: ['sessions', 'upcoming'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useRescheduleSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => sessionApi.reschedule(id, payload),
    onSuccess: () => {
      toast.success('Session rescheduled');
      qc.invalidateQueries({ queryKey: ['sessions', 'upcoming'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useCancelSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionApi.cancel(id),
    onSuccess: () => {
      toast.success('Session canceled');
      qc.invalidateQueries({ queryKey: ['sessions', 'upcoming'] });
      qc.invalidateQueries({ queryKey: ['sessions', 'history'] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}
