import { ProfileHeader } from "./components/ProfileHeader";
import { MentorStatisticsCard } from "./components/MentorStatisticsCard";
import { QuickActions } from "./components/QuickActions";
import { ProfileSkeleton } from "./components/ProfileSkeleton";

import { useMentorProfile } from "./hooks/useMentorProfile";
import { mentorProfileQueryKey } from "./hooks/useMentorProfile";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/api";

export function MentorProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useMentorProfile();

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

  const handleProfileUpdated = () => {
    queryClient.invalidateQueries({ queryKey: mentorProfileQueryKey });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Mentor Profile</div>
          <h2 className="text-2xl font-semibold tracking-tight">{profile?.name ?? "Profile"}</h2>
          <p className="text-sm text-muted-foreground">Manage your mentor profile details.</p>
        </div>

        <ProfileHeader profile={profile} onProfileUpdated={handleProfileUpdated} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
          </div>

          <div className="space-y-6">
            <MentorStatisticsCard
              profile={profile}
            />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorProfilePage;
