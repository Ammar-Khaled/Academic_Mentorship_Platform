// src/api/session.js
import { api } from '@/lib/api';

export const sessionApi = {
  book: (payload) => api.post('/sessions/book', payload),
  upcoming: () => api.get('/sessions/student/upcoming'),
  history: () => api.get('/sessions/student/history'),
  reschedule: (id, payload) => api.patch(`/sessions/${id}/reschedule`, payload),
  cancel: (id) => api.patch(`/sessions/${id}/cancel`),
};
