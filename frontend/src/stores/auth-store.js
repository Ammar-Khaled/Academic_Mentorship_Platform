import { create } from 'zustand';
import { api, clearStoredToken, getErrorMessage, getStoredToken, setStoredToken } from '@/lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth(authResponse) {
    setStoredToken(authResponse.access_token);
    set({
      user: authResponse.user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth() {
    clearStoredToken();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    get().setAuth(data);
    return data;
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    if (data.access_token) {
      get().setAuth(data);
    }
    return data;
  },

  async fetchProfile() {
    const token = getStoredToken();
    if (!token) {
      set({ isLoading: false });
      return null;
    }

    try {
      const { data } = await api.get('/auth/profile');
      set({
        user: data,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch {
      get().clearAuth();
      return null;
    }
  },

  logout() {
    get().clearAuth();
  },
}));

export { getErrorMessage };
