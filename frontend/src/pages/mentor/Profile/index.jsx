import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileOverview } from "./components/ProfileOverview";
import { MentorStatisticsCard } from "./components/MentorStatisticsCard";
import { AccountStatusCard } from "./components/AccountStatusCard";
import { QuickActions } from "./components/QuickActions";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { ProfileInformationForm } from "./forms/ProfileInformationForm";

import { useMentorProfile } from "./hooks/useMentorProfile";
// Optional:
// import { useMentorProfileStats } from "./hooks/useMentorProfileStats";
import { getErrorMessage } from "@/lib/api";

export function MentorProfilePage() {
  const profileQuery = useMentorProfile();
  // Optional stats:
  // const { availabilityQuery, totalSessionsQuery } = useMentorProfileStats();

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <ProfileSkeleton />
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-destructive">{getErrorMessage(profileQuery.error)}</div>
      </div>
    );
  }

  const profile = profileQuery.data;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Mentor Profile</div>
          <h2 className="text-2xl font-semibold tracking-tight">{profile?.name ?? "Profile"}</h2>
          <p className="text-sm text-muted-foreground">Manage your mentor profile details.</p>
        </div>

        <ProfileHeader profile={profile} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ProfileOverview profile={profile} />
            <ProfileInformationForm profile={profile} />
          </div>

          <div className="space-y-6">
            <MentorStatisticsCard
              profile={profile}
              // Optional real stats if you wire the stats hook:
              // totalSessions={totalSessionsQuery.data?.total}
              // availabilityCount={availabilityQuery.data?.length}
            />
            <AccountStatusCard profile={profile} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorProfilePage;
