import { create } from "zustand";

export const useMentorStore = create((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),

  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  selectedAvailability: null,
  selectedDayFilter: "all",

  openCreateDialog: () => set({ isCreateDialogOpen: true }),
  closeCreateDialog: () => set({ isCreateDialogOpen: false }),

  openEditDialog: (availability) =>
    set({
      isEditDialogOpen: true,
      selectedAvailability: availability,
    }),

  closeEditDialog: () =>
    set({
      isEditDialogOpen: false,
      selectedAvailability: null,
    }),

  setSelectedDayFilter: (day) => set({ selectedDayFilter: day }),

  isEvaluationDetailsOpen: false,
  isEvaluationFormOpen: false,
  selectedEvaluation: null,
  evaluationFilters: {
    search: "",
    reviewStatus: "all",
    date: "",
  },

  openEvaluationDetails: (session) =>
    set({
      isEvaluationDetailsOpen: true,
      selectedEvaluation: session,
    }),

  closeEvaluationDetails: () =>
    set({
      isEvaluationDetailsOpen: false,
      selectedEvaluation: null,
    }),

  openEvaluationForm: (session) =>
    set({
      isEvaluationFormOpen: true,
      selectedEvaluation: session,
    }),

  closeEvaluationForm: () =>
    set({
      isEvaluationFormOpen: false,
    }),

  setEvaluationFilters: (patch) =>
    set((state) => ({
      evaluationFilters: {
        ...state.evaluationFilters,
        ...patch,
      },
    })),

  isSessionDetailsOpen: false,
  selectedSession: null,
  sessionFilters: {
    tab: "all",
    status: "all",
    search: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  },

  openSessionDetails: (session) =>
    set({
      isSessionDetailsOpen: true,
      selectedSession: session,
    }),

  closeSessionDetails: () =>
    set({
      isSessionDetailsOpen: false,
      selectedSession: null,
    }),

  setSessionFilters: (patch) =>
    set((state) => ({
      sessionFilters: {
        ...state.sessionFilters,
        ...patch,
      },
    })),
}));
