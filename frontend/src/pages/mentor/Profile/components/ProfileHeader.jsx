import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function initials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "M";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function ProfileHeader({ profile }) {
  const verificationLabel = profile?.isVerified ? "Verified" : "Unverified";
  const verificationVariant = profile?.isVerified ? "secondary" : "outline";

  // stack is populated: { name, description }
  const stackName = profile?.stack?.name ?? null;

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
              <AvatarFallback className="bg-muted text-foreground">{initials(profile?.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{profile?.name ?? "—"}</h1>
                <Badge variant={verificationVariant}>{verificationLabel}</Badge>
                <Badge variant="outline">★ {typeof profile?.averageRating === "number" ? profile.averageRating : "—"}</Badge>
              </div>

              <p className="text-sm text-muted-foreground sm:text-base">{profile?.title ?? "—"}</p>

              {stackName ? (
                <>
                  <Separator />
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xs font-medium text-muted-foreground">Stack:</div>
                    <Badge variant="secondary" className="font-normal">
                      {stackName}
                    </Badge>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 lg:gap-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">Hourly Rate</div>
              <div className="mt-1 text-base font-semibold">
                ${typeof profile?.hourlyRate === "number" ? profile.hourlyRate : "—"}
                /hr
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="mt-1 truncate text-sm font-semibold">{profile?.user?.email ?? "—"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
