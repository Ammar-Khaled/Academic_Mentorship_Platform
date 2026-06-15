import { useAuthStore } from "@/stores/auth-store";
import { DASHBOARD_COPY } from "./constants";

import { useDashboardStats } from "./hooks/useDashboardStats";
import { useUpcomingSessions } from "./hooks/useUpcomingSessions";
import { useRecentEvaluations } from "./hooks/useRecentEvaluations";
import { useWeeklyAvailability } from "./hooks/useWeeklyAvailability";

import { DashboardHeader } from "./components/DashboardHeader";
import { SummaryCards } from "./components/SummaryCards";
import { UpcomingSessionsTable } from "./components/UpcomingSessionsTable";
import { WeeklyAvailabilityPreview } from "./components/WeeklyAvailabilityPreview";
import { RecentEvaluationNotes } from "./components/RecentEvaluationNotes";
import { QuickActions } from "./components/QuickActions";
import { DashboardSkeleton } from "./components/DashboardSkeleton";

export function MentorDashboardPage() {
  // ─── Auth ────────────────────────────────────────────────────────────────
  const user = useAuthStore((state) => state.user);
  const mentorName = user?.name ?? user?.email ?? "Mentor";

  // ─── Server State ─────────────────────────────────────────────────────────
  const { stats, isLoading: isLoadingStats } = useDashboardStats();
  const { sessions, isLoading: isLoadingSessions } = useUpcomingSessions();
  const { sessions: evaluations, isLoading: isLoadingEvals } = useRecentEvaluations();
  const { availability, isLoading: isLoadingAvailability } = useWeeklyAvailability();

  const isLoading = isLoadingStats || isLoadingSessions || isLoadingEvals || isLoadingAvailability;

  // ─── Loading State ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">{DASHBOARD_COPY.title}</div>
          <DashboardHeader mentorName={mentorName} />
          <p className="text-sm text-muted-foreground">{DASHBOARD_COPY.subtitle}</p>
        </div>

        {/* Statistics Cards */}
        <SummaryCards stats={stats} />

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Upcoming Sessions Table — spans 2 cols */}
          <div className="lg:col-span-2">
            <UpcomingSessionsTable sessions={sessions} />
          </div>

          {/* Right rail */}
          <div className="space-y-6">
            <WeeklyAvailabilityPreview availability={availability} />
            <RecentEvaluationNotes sessions={evaluations} />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}

export default MentorDashboardPage;
