import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { useStudentProfile, studentProfileQueryKey } from "./hooks/useStudentProfile";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/api";

export function StudentProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useStudentProfile();

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
    queryClient.invalidateQueries({ queryKey: studentProfileQueryKey });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Student Profile</div>
          <h2 className="text-2xl font-semibold tracking-tight">{profile?.name ?? "Profile"}</h2>
          <p className="text-sm text-muted-foreground">Manage your student profile details.</p>
        </div>

        <ProfileHeader profile={profile} onProfileUpdated={handleProfileUpdated} />
      </div>
    </div>
  );
}

export default StudentProfilePage;
